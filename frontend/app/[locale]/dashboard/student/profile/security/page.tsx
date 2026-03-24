"use client";

import { ShieldCheck, Lock, Smartphone, ChevronRight, Mail, Key, Check, X, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod: "email" | "sms" | "app";
  email: string;
  phone?: string;
  lastPasswordChange: string;
  activeSessions: number;
}

export default function SecurityPage() {
  const { data: session } = useSession();
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // 2FA form
  const [twoFactorForm, setTwoFactorForm] = useState({
    method: "email" as "email" | "sms" | "app",
    verificationCode: "",
  });

  const cardStyle = "bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all";

  useEffect(() => {
    loadSecuritySettings();
  }, [session]);

  const loadSecuritySettings = async () => {
    try {
      setLoading(true);
      
      if (session?.user) {
        const response = await fetch('/api/user/security', {
          headers: {
            'Authorization': `Bearer ${(session.user as any)?.accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSecuritySettings(data);
        } else {
          // Utiliser des données mockées
          setSecuritySettings({
            twoFactorEnabled: false,
            twoFactorMethod: "email",
            email: session.user.email || "",
            phone: "+33 6 12 34 56 78",
            lastPasswordChange: "2024-03-15",
            activeSessions: 2
          });
        }
      }
    } catch (error) {
      console.error("Error loading security settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage("Les mots de passe ne correspondent pas", "error");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      showMessage("Le mot de passe doit contenir au moins 8 caractères", "error");
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(session?.user as any)?.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (response.ok) {
        showMessage("Mot de passe mis à jour avec succès");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowPasswordForm(false);
        loadSecuritySettings(); // Recharger les paramètres
      } else {
        const error = await response.json();
        showMessage(error.message || "Erreur lors de la mise à jour du mot de passe", "error");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      showMessage("Erreur lors de la mise à jour du mot de passe", "error");
    } finally {
      setLoading(false);
    }
  };

  const handle2FAToggle = async () => {
    if (!securitySettings) return;

    try {
      setLoading(true);
      
      if (!securitySettings.twoFactorEnabled) {
        // Activer 2FA - envoyer le code
        setShow2FAModal(true);
        
        const response = await fetch('/api/user/2fa/setup', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${(session?.user as any)?.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            method: twoFactorForm.method
          })
        });

        if (response.ok) {
          setShowVerificationCode(true);
          showMessage(`Un code de vérification a été envoyé par ${twoFactorForm.method === "email" ? "email" : "SMS"}`);
        } else {
          throw new Error("Erreur lors de l'envoi du code");
        }
      } else {
        // Désactiver 2FA
        const response = await fetch('/api/user/2fa/disable', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${(session?.user as any)?.accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          showMessage("2FA désactivé avec succès");
          loadSecuritySettings();
        } else {
          throw new Error("Erreur lors de la désactivation du 2FA");
        }
      }
    } catch (error) {
      console.error("Error toggling 2FA:", error);
      showMessage("Erreur lors de la modification du 2FA", "error");
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerification = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/user/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(session?.user as any)?.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: twoFactorForm.verificationCode,
          method: twoFactorForm.method
        })
      });

      if (response.ok) {
        showMessage("2FA activé avec succès");
        setShow2FAModal(false);
        setShowVerificationCode(false);
        setTwoFactorForm({ ...twoFactorForm, verificationCode: "" });
        loadSecuritySettings();
      } else {
        const error = await response.json();
        showMessage(error.message || "Code de vérification invalide", "error");
      }
    } catch (error) {
      console.error("Error verifying 2FA:", error);
      showMessage("Erreur lors de la vérification", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !securitySettings) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
            <div className="h-4 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-[#002B24]">Sécurité</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ShieldCheck className="w-4 h-4" />
          <span>Protection active</span>
        </div>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center gap-2 ${
            messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {messageType === "success" ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message}
        </motion.div>
      )}

      {/* Changement de mot de passe */}
      <div className={cardStyle}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <Lock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#002B24]">Mot de passe</h3>
              <p className="text-sm text-gray-400">
                Dernière modification : {securitySettings?.lastPasswordChange ? 
                  new Date(securitySettings.lastPasswordChange).toLocaleDateString('fr-FR') : 
                  "Il y a 3 mois"
                }
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-primary hover:underline font-medium"
          >
            {showPasswordForm ? "Annuler" : "Modifier"}
          </button>
        </div>
        
        {showPasswordForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            onSubmit={handlePasswordChange}
            className="space-y-6 border-t pt-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <input 
                  type={showPasswords.current ? "text" : "password"}
                  placeholder="Mot de passe actuel"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 pr-12 outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              <div className="relative">
                <input 
                  type={showPasswords.new ? "text" : "password"}
                  placeholder="Nouveau mot de passe"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 pr-12 outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              <div className="relative">
                <input 
                  type={showPasswords.confirm ? "text" : "password"}
                  placeholder="Confirmer le mot de passe"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 pr-12 outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </button>
              <button 
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
            </div>
          </motion.form>
        )}
        
        {!showPasswordForm && (
          <button className="text-sm font-black text-primary hover:underline italic">
            Mot de passe oublié ?
          </button>
        )}
      </div>

      {/* Double Authentification (2FA) */}
      <div className={cardStyle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
              <Smartphone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#002B24]">Authentification à deux facteurs</h3>
              <p className="text-sm text-gray-400">
                {securitySettings?.twoFactorEnabled 
                  ? `Activé via ${securitySettings.twoFactorMethod === "email" ? "email" : securitySettings.twoFactorMethod === "sms" ? "SMS" : "application"}` 
                  : "Ajoutez une couche de sécurité supplémentaire"
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold uppercase tracking-widest ${
              securitySettings?.twoFactorEnabled ? "text-green-600" : "text-gray-400"
            }`}>
              {securitySettings?.twoFactorEnabled ? "Activé" : "Désactivé"}
            </span>
            <button
              onClick={handle2FAToggle}
              disabled={loading}
              className={`w-12 h-6 rounded-full relative transition-colors disabled:opacity-50 ${
                securitySettings?.twoFactorEnabled ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                securitySettings?.twoFactorEnabled ? "right-1" : "left-1"
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal 2FA */}
      {show2FAModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShow2FAModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {showVerificationCode ? "Vérification" : "Activer 2FA"}
            </h3>

            {!showVerificationCode ? (
              <div className="space-y-6">
                <p className="text-gray-600">
                  Choisissez la méthode pour recevoir votre code de vérification
                </p>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="method"
                      value="email"
                      checked={twoFactorForm.method === "email"}
                      onChange={(e) => setTwoFactorForm({ ...twoFactorForm, method: "email" })}
                      className="text-primary"
                    />
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-gray-500">{securitySettings?.email}</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="method"
                      value="sms"
                      checked={twoFactorForm.method === "sms"}
                      onChange={(e) => setTwoFactorForm({ ...twoFactorForm, method: "sms" })}
                      className="text-primary"
                    />
                    <Smartphone className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium">SMS</div>
                      <div className="text-sm text-gray-500">{securitySettings?.phone}</div>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShow2FAModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handle2FAToggle}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Envoi..." : "Envoyer le code"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-gray-600">
                  Entrez le code à 6 chiffres envoyé par {twoFactorForm.method === "email" ? "email" : "SMS"}
                </p>
                
                <input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={twoFactorForm.verificationCode}
                  onChange={(e) => setTwoFactorForm({ ...twoFactorForm, verificationCode: e.target.value })}
                  className="w-full text-center text-2xl font-bold tracking-widest bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowVerificationCode(false);
                      setShow2FAModal(false);
                    }}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handle2FAVerification}
                    disabled={loading || twoFactorForm.verificationCode.length !== 6}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Vérification..." : "Vérifier"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Sessions actives */}
      {securitySettings && (
        <div className={cardStyle}>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#002B24]">Sessions actives</h3>
              <p className="text-sm text-gray-400">{securitySettings.activeSessions} appareils connectés</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Chrome - Windows</div>
                  <div className="text-sm text-gray-500">Paris, France • Session actuelle</div>
                </div>
              </div>
              <span className="text-xs text-green-600 font-medium">Actif</span>
            </div>
            
            {securitySettings.activeSessions > 1 && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Safari - iPhone</div>
                    <div className="text-sm text-gray-500">Lyon, France • Il y a 2 heures</div>
                  </div>
                </div>
                <button className="text-xs text-red-600 font-medium hover:underline">
                  Déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}