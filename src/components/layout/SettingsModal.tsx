'use client';

import React, { useState } from 'react';
import { Language, translations } from '@/lib/i18n';
import { X, User, Globe, Check, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerName: string;
  onSaveOwnerName: (name: string, username: string) => void;
  ownerUsername: string;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  ownerName,
  onSaveOwnerName,
  ownerUsername,
  language,
  onSelectLanguage,
}: SettingsModalProps) {
  const [name, setName] = useState(ownerName);
  const [username, setUsername] = useState(ownerUsername);
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSaveOwnerName(name.trim(), username.trim());
    onSelectLanguage(selectedLang);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {t.ownerSettingsTitle}
              </h3>
              <p className="text-[11px] text-slate-400">{t.ownerSettingsSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Owner Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.ownerNameLabel}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nova Suharyanto"
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-1 text-[10px] text-slate-400">
              {language === 'id'
                ? 'Nama ini akan ditampilkan di profil dan kop laporan cetak keuangan.'
                : 'This name will appear on your profile and official financial report prints.'}
            </p>
          </div>

          {/* Username / Tag Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.ownerUsernameLabel}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. kangnova"
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-indigo-500" />
              <span>{t.languageSelectLabel}</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedLang('id')}
                className={`flex items-center justify-between rounded-xl p-3 border text-xs font-bold transition-all ${
                  selectedLang === 'id'
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🇮🇩</span>
                  <span>Indonesia</span>
                </div>
                {selectedLang === 'id' && <Check className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={() => setSelectedLang('en')}
                className={`flex items-center justify-between rounded-xl p-3 border text-xs font-bold transition-all ${
                  selectedLang === 'en'
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🇬🇧</span>
                  <span>English</span>
                </div>
                {selectedLang === 'en' && <Check className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-5 flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>{language === 'id' ? 'Tersimpan!' : 'Saved!'}</span>
                </>
              ) : (
                <span>{t.saveSettingsBtn}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
