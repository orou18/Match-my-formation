"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Folder,
  File,
  Video,
  Image,
  Music,
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  Calendar,
  Tag,
  Star,
  Lock,
  Globe,
  MoreHorizontal,
  Copy,
  Move,
  Archive,
  FolderPlus,
  FilePlus,
} from "lucide-react";

interface LibraryItem {
  id: string;
  name: string;
  type: "folder" | "video" | "image" | "audio" | "document";
  size?: string;
  duration?: string;
  thumbnail?: string;
  createdAt: string;
  modifiedAt: string;
  tags: string[];
  visibility: "public" | "private";
  starred: boolean;
  path: string;
  children?: LibraryItem[];
}

export default function LibraryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("name");
  const [filterType, setFilterType] = useState("all");

  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);

  useEffect(() => {
    const loadItems = async () => {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("token")
          : null;
      const response = await fetch("/api/creator/library", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();
      if (response.ok) {
        setLibraryItems(data.items || []);
      }
    };

    loadItems();
  }, []);

  const filteredItems = libraryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesType = filterType === "all" || item.type === filterType;

    return matchesSearch && matchesType;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "date":
        return (
          new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()
        );
      case "size":
        return (
          (b.size ? parseInt(b.size) : 0) - (a.size ? parseInt(a.size) : 0)
        );
      case "type":
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const getItemIcon = (type: string) => {
    switch (type) {
      case "folder":
        return Folder;
      case "video":
        return Video;
      case "image":
        return Image;
      case "audio":
        return Music;
      case "document":
        return FileText;
      default:
        return File;
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case "folder":
        return "from-yellow-500 to-orange-500";
      case "video":
        return "from-red-500 to-pink-500";
      case "image":
        return "from-green-500 to-teal-500";
      case "audio":
        return "from-purple-500 to-indigo-500";
      case "document":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const formatFileSize = (size?: string) => {
    if (!size) return "";
    return size;
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleStar = (itemId: string) => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("token")
        : null;
    setLibraryItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, starred: !item.starred } : item
      )
    );
    fetch("/api/creator/library", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ id: itemId }),
    });
  };

  const handleItemAction = (action: string, itemId: string) => {
    console.log(`Action ${action} on item ${itemId}`);
  };

  const stats = {
    total: libraryItems.length,
    folders: libraryItems.filter((item) => item.type === "folder").length,
    videos: libraryItems.filter((item) => item.type === "video").length,
    images: libraryItems.filter((item) => item.type === "image").length,
    audio: libraryItems.filter((item) => item.type === "audio").length,
    documents: libraryItems.filter((item) => item.type === "document").length,
    starred: libraryItems.filter((item) => item.starred).length,
    totalSize: "645 MB",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bibliothèque
            </h1>
            <p className="text-gray-600">
              Gérez tous vos fichiers et ressources
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher des fichiers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
      >
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <File className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">{stats.total}</span>
          <p className="text-xs text-gray-600">Total</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Folder className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">
            {stats.folders}
          </span>
          <p className="text-xs text-gray-600">Dossiers</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">
            {stats.videos}
          </span>
          <p className="text-xs text-gray-600">Vidéos</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Image className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">
            {stats.images}
          </span>
          <p className="text-xs text-gray-600">Images</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">{stats.audio}</span>
          <p className="text-xs text-gray-600">Audio</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">
            {stats.documents}
          </span>
          <p className="text-xs text-gray-600">Docs</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Star className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">
            {stats.starred}
          </span>
          <p className="text-xs text-gray-600">Favoris</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Download className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">
            {stats.totalSize}
          </span>
          <p className="text-xs text-gray-600">Taille</p>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Tous les types</option>
              <option value="folder">Dossiers</option>
              <option value="video">Vidéos</option>
              <option value="image">Images</option>
              <option value="audio">Audio</option>
              <option value="document">Documents</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="name">Nom</option>
              <option value="date">Date</option>
              <option value="size">Taille</option>
              <option value="type">Type</option>
            </select>

            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 flex items-center gap-2">
              <FolderPlus className="w-4 h-4" />
              Nouveau dossier
            </button>
            <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 flex items-center gap-2">
              <FilePlus className="w-4 h-4" />
              Nouveau fichier
            </button>
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {selectedItems.length} élément(s) sélectionné(s)
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center gap-1">
                <Move className="w-3 h-3" />
                Déplacer
              </button>
              <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center gap-1">
                <Copy className="w-3 h-3" />
                Copier
              </button>
              <button className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 flex items-center gap-1">
                <Archive className="w-3 h-3" />
                Archiver
              </button>
              <button className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 flex items-center gap-1">
                <Trash2 className="w-3 h-3" />
                Supprimer
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Library Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {sortedItems.map((item, index) => {
              const ItemIcon = getItemIcon(item.type);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="group cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className="absolute top-2 left-2 z-10 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    />

                    <button
                      onClick={() => toggleStar(item.id)}
                      className="absolute top-2 right-2 z-10 p-1 bg-white/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Star
                        className={`w-4 h-4 ${item.starred ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`}
                      />
                    </button>

                    <div className="aspect-square bg-gray-50 rounded-xl border border-gray-200 overflow-hidden group-hover:border-primary transition-colors">
                      {item.type === "folder" ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div
                            className={`w-16 h-16 bg-gradient-to-br ${getItemColor(item.type)} rounded-2xl flex items-center justify-center shadow-lg`}
                          >
                            <ItemIcon className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      ) : item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div
                            className={`w-16 h-16 bg-gradient-to-br ${getItemColor(item.type)} rounded-2xl flex items-center justify-center shadow-lg`}
                          >
                            <ItemIcon className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-2">
                      <h3
                        className="font-medium text-gray-900 text-sm truncate"
                        title={item.name}
                      >
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {item.size && (
                          <span className="text-xs text-gray-500">
                            {item.size}
                          </span>
                        )}
                        {item.duration && (
                          <span className="text-xs text-gray-500">
                            {item.duration}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {item.visibility === "public" ? (
                          <Globe className="w-3 h-3 text-green-500" />
                        ) : (
                          <Lock className="w-3 h-3 text-gray-400" />
                        )}
                        <span className="text-xs text-gray-500">
                          {item.modifiedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedItems.map((item, index) => {
              const ItemIcon = getItemIcon(item.type);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItemSelection(item.id)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />

                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${getItemColor(item.type)} rounded-xl flex items-center justify-center shadow-md`}
                  >
                    <ItemIcon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      {item.starred && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{item.type}</span>
                      {item.size && <span>{item.size}</span>}
                      {item.duration && <span>{item.duration}</span>}
                      <span>{item.modifiedAt}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {item.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.visibility === "public" ? (
                      <Globe className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}

                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>

                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>

                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {sortedItems.length === 0 && (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun fichier trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterType !== "all"
                ? "Essayez de modifier vos filtres de recherche"
                : "Commencez par uploader vos premiers fichiers"}
            </p>
            <button className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto">
              <Upload className="w-5 h-5" />
              Upload des fichiers
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
