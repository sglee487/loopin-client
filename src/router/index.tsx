import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PlaylistsPage from '@/features/playlists/PlaylistsPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 루트 → PlaylistsPage */}
        <Route path="/"           element={<PlaylistsPage />} />
        {/* URL에 /playlists 로 접근해도 동일 페이지 활용 */}
        <Route path="/playlists"  element={<PlaylistsPage />} />

        {/* 기타 상세·편집 등 필요 시 추가
            <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
        */}

        {/* 잘못된 주소는 홈으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
