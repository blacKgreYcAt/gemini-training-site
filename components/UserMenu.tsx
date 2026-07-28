'use client';

import { useAuth } from '@/lib/auth-context';
import { signOut } from '@/lib/auth-utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function UserMenu() {
  const { user } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/auth');
    } catch (error) {
      console.error('登出失敗:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          backgroundColor: '#0071e3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 16px',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: '14px'
        }}
      >
        👤 {user.name || user.email.split('@')[0]}
      </button>

      {showMenu && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            marginTop: '8px',
            backgroundColor: 'white',
            border: '1px solid #e5e5e7',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '200px',
            zIndex: 1000
          }}
        >
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e7' }}>
            <div style={{ fontSize: '12px', color: '#999' }}>已登入</div>
            <div style={{ fontSize: '14px', color: '#000', marginTop: '4px' }}>
              {user.email}
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#d9534f',
              cursor: 'pointer',
              fontSize: '14px',
              textAlign: 'left',
              fontWeight: 500
            }}
          >
            登出
          </button>
        </div>
      )}
    </div>
  );
}
