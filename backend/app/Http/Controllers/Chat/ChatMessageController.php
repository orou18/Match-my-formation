<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\Employee;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatMessageController extends Controller
{
    /**
     * Récupère tous les messages d'une vidéo
     * GET /api/videos/{videoId}/messages
     */
    public function getVideoMessages($videoId)
    {
        try {
            $video = Video::findOrFail($videoId);

            $messages = ChatMessage::forVideo($videoId)
                ->with(['user:id,name,email,avatar', 'replies.user:id,name,email,avatar'])
                ->whereNull('reply_to') // Messages principaux uniquement
                ->get()
                ->map(function ($message) {
                    return [
                        'id' => $message->id,
                        'user' => [
                            'id' => $message->user->id,
                            'name' => $message->user->name,
                            'email' => $message->user->email,
                            'profile_picture' => $message->user->avatar,
                        ],
                        'message' => $message->message,
                        'is_question' => $message->is_question,
                        'status' => $message->status,
                        'likes_count' => $message->likes_count ?? 0,
                        'replies_count' => $message->replies->count(),
                        'created_at' => $message->created_at->toIso8601String(),
                        'replies' => $message->replies->map(function ($reply) {
                            return [
                                'id' => $reply->id,
                                'user' => [
                                    'id' => $reply->user->id,
                                    'name' => $reply->user->name,
                                    'email' => $reply->user->email,
                                    'profile_picture' => $reply->user->avatar,
                                ],
                                'message' => $reply->message,
                                'created_at' => $reply->created_at->toIso8601String(),
                            ];
                        })->values(),
                    ];
                })
                ->values();

            return response()->json([
                'success' => true,
                'data' => $messages,
                'total' => $messages->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des messages',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Poster un nouveau message
     * POST /api/videos/{videoId}/messages
     */
    public function storeMessage(Request $request, $videoId)
    {
        try {
            $validated = $request->validate([
                'message' => 'required|string|max:2000',
                'is_question' => 'nullable|boolean',
            ]);

            $video = Video::findOrFail($videoId);
            $user = Auth::user();

            if ($user instanceof Employee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Les employés ne peuvent pas publier dans ce chat.',
                ], 403);
            }

            $chatMessage = ChatMessage::create([
                'video_id' => $videoId,
                'user_id' => $user->id,
                'message' => $validated['message'],
                'is_question' => $validated['is_question'] ?? false,
                'status' => 'pending',
                'likes_count' => 0,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Message posté avec succès',
                'data' => [
                    'id' => $chatMessage->id,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'profile_picture' => $user->avatar,
                    ],
                    'message' => $chatMessage->message,
                    'is_question' => $chatMessage->is_question,
                    'status' => $chatMessage->status,
                    'likes_count' => 0,
                    'replies_count' => 0,
                    'created_at' => $chatMessage->created_at->toIso8601String(),
                    'replies' => [],
                ],
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation échouée',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du message',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mets à jour un message
     * PUT /api/messages/{messageId}
     */
    public function updateMessage(Request $request, $messageId)
    {
        try {
            $chatMessage = ChatMessage::findOrFail($messageId);
            $user = Auth::user();

            // Vérifier que c'est l'auteur du message
            if ($chatMessage->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non autorisé à modifier ce message',
                ], 403);
            }

            $validated = $request->validate([
                'message' => 'required|string|max:2000',
            ]);

            $chatMessage->update([
                'message' => $validated['message'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Message mis à jour avec succès',
                'data' => [
                    'id' => $chatMessage->id,
                    'message' => $chatMessage->message,
                    'updated_at' => $chatMessage->updated_at->toIso8601String(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du message',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Supprime un message
     * DELETE /api/messages/{messageId}
     */
    public function deleteMessage($messageId)
    {
        try {
            $chatMessage = ChatMessage::findOrFail($messageId);
            $user = Auth::user();

            // Vérifier que c'est l'auteur du message
            if ($chatMessage->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non autorisé à supprimer ce message',
                ], 403);
            }

            // Si c'est une question avec des réponses, supprimer les réponses aussi
            if ($chatMessage->is_question) {
                $chatMessage->replies()->delete();
            }

            $chatMessage->delete();

            return response()->json([
                'success' => true,
                'message' => 'Message supprimé avec succès',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du message',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Like/Unlike a message
     * POST /api/messages/{messageId}/like
     */
    public function likeMessage($messageId)
    {
        try {
            $chatMessage = ChatMessage::findOrFail($messageId);

            $chatMessage->increment('likes_count');

            return response()->json([
                'success' => true,
                'message' => 'Like ajouté',
                'data' => [
                    'id' => $chatMessage->id,
                    'likes_count' => $chatMessage->likes_count,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du like du message',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Récupère les notifications de chat pour le creator
     * GET /api/creator/chat/notifications
     */
    public function getCreatorChatNotifications()
    {
        try {
            $user = Auth::user();

            // Vérifier que c'est un creator
            if ($user->role !== 'creator') {
                return response()->json([
                    'success' => false,
                    'message' => 'Seuls les creators peuvent accéder à ces notifications',
                ], 403);
            }

            // Récupérer les vidéos du creator
            $videos = Video::where('uploader_id', $user->id)->pluck('id');

            // Récupérer les questions unanswered
            $notifications = ChatMessage::whereIn('video_id', $videos)
                ->where('is_question', true)
                ->where('status', '!=', 'resolved')
                ->with(['user:id,name,email,avatar', 'video:id,title'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($message) {
                    return [
                        'id' => $message->id,
                        'video_id' => $message->video_id,
                        'video_title' => $message->video->title,
                        'student' => [
                            'id' => $message->user->id,
                            'name' => $message->user->name,
                            'email' => $message->user->email,
                            'profile_picture' => $message->user->avatar,
                        ],
                        'question' => $message->message,
                        'status' => $message->status,
                        'replies_count' => $message->replies->count(),
                        'created_at' => $message->created_at->toIso8601String(),
                    ];
                })
                ->values();

            return response()->json([
                'success' => true,
                'data' => $notifications,
                'total' => $notifications->count(),
                'unresolved_count' => $notifications->where('status', '!=', 'resolved')->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des notifications',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Réponse du creator à une question
     * POST /api/creator/chat/messages/{messageId}/reply
     */
    public function replyToMessage(Request $request, $messageId)
    {
        try {
            $originalMessage = ChatMessage::findOrFail($messageId);
            $user = Auth::user();

            // Vérifier que le message original est une question
            if (!$originalMessage->is_question) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce message n\'est pas une question',
                ], 400);
            }

            // Vérifier que c'est le creator de la vidéo
            $video = $originalMessage->video;
            if ($video->uploader_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'êtes pas le creator de cette vidéo',
                ], 403);
            }

            $validated = $request->validate([
                'message' => 'required|string|max:2000',
            ]);

            $reply = ChatMessage::create([
                'video_id' => $originalMessage->video_id,
                'user_id' => $user->id,
                'message' => $validated['message'],
                'reply_to' => $messageId,
                'is_question' => false,
                'status' => 'answered',
                'likes_count' => 0,
            ]);

            // Marquer le message original comme répondu
            $originalMessage->update(['status' => 'answered']);

            return response()->json([
                'success' => true,
                'message' => 'Réponse ajoutée avec succès',
                'data' => [
                    'id' => $reply->id,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ],
                    'message' => $reply->message,
                    'created_at' => $reply->created_at->toIso8601String(),
                ],
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation échouée',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'ajout de la réponse',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Marque une question comme résolue
     * POST /api/creator/chat/messages/{messageId}/mark-resolved
     */
    public function markAsResolved($messageId)
    {
        try {
            $chatMessage = ChatMessage::findOrFail($messageId);
            $user = Auth::user();

            // Vérifier que c'est une question
            if (!$chatMessage->is_question) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce message n\'est pas une question',
                ], 400);
            }

            // Vérifier que c'est le creator de la vidéo
            $video = $chatMessage->video;
            if ($video->uploader_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'êtes pas le creator de cette vidéo',
                ], 403);
            }

            $chatMessage->update(['status' => 'resolved']);

            return response()->json([
                'success' => true,
                'message' => 'Question marquée comme résolue',
                'data' => [
                    'id' => $chatMessage->id,
                    'status' => 'resolved',
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la marque de résolution',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
