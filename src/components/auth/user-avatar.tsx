'use client';

import { useAuth } from '@/hooks/use-auth';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserAvatar({ className }: { className?: string }) {
  const { user } = useAuth();

  return (
    <Avatar className={className}>
      {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name || ''} />}
      <AvatarFallback className="bg-zinc-200 text-zinc-600">
        <User className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
}
