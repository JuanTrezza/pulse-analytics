/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Shield, Key, History, Save } from 'lucide-react';

interface PerfilViewProps {
  onShowToast: (message: string) => void;
}

export default function PerfilView({ onShowToast }: PerfilViewProps) {
  const [name, setName] = useState('Admin Pulse');
  const [email, setEmail] = useState('jgmorenotrezza@gmail.com');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast("Información de perfil actualizada.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="font-sans text-3xl font-extrabold text-on-surface tracking-tight">Perfil de administrador</h1>
        <p className="text-on-surface-variant text-sm font-sans mt-1">Supervisa tu cuenta, credenciales de acceso y logs de actividad.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-surface-container micro-border rounded-xl p-6 flex flex-col items-center text-center">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop" 
            alt="Admin User" 
            className="w-24 h-24 rounded-full object-cover border-2 border-primary/40 shadow-xl"
          />
          <h3 className="font-sans text-base font-bold text-on-surface mt-4">{name}</h3>
          <span className="text-[10px] font-bold text-primary font-mono bg-primary/10 px-2 py-0.5 rounded mt-1 uppercase tracking-wider">Superadministrador</span>
          
          <div className="w-full space-y-3 mt-8 pt-6 border-t border-outline-variant/10 text-left text-xs">
            <div className="flex justify-between">
              <span className="text-outline">Sesión activa</span>
              <span className="text-on-surface font-semibold font-mono">CABA, AR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline">Último acceso</span>
              <span className="text-on-surface font-semibold font-mono">Hace 2 min</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container micro-border rounded-xl p-6 lg:col-span-2">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/10">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-sans text-base font-bold text-on-surface">Datos de la cuenta</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block mb-1">Nombre completo</label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block mb-1">Correo electrónico</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-primary hover:brightness-110 active:scale-98 text-on-primary font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/10"
            >
              <Save className="w-4 h-4" />
              <span>Guardar perfil</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
