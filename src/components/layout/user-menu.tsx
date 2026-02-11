'use client';

import { useAuth } from '@/hooks/use-auth';
import { useTranslations } from 'next-intl';
import { User, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { config } from '@/lib/config';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const t = useTranslations('auth');

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-zinc-400">
        <Avatar className="h-8 w-8">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name || ''} />}
          <AvatarFallback className="bg-zinc-200 text-zinc-600 text-xs">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm">
          <p className="font-medium text-zinc-900">{user.name || 'User'}</p>
          {user.email && (
            <p className="text-xs text-zinc-500">{user.email}</p>
          )}
        </div>
        {config.auth.enabled && (
          <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            {t('logout')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
