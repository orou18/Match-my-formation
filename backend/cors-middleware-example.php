<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class HandleCors
{
    public function handle(Request $request, Closure $next)
    {
        // Ajouter les headers CORS
        $response = $next($request);
        
        $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:3001');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        
        // Gérer les requêtes preflight OPTIONS
        if ($request->getMethod() === 'OPTIONS') {
            $response->setStatusCode(200);
        }
        
        return $response;
    }
}
