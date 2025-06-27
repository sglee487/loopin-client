import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ListPage from "@/features/playlists/pages/ListPage";
import DetailPage from "@/features/playlists/pages/DetailPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* 루트 → PlaylistsPage */}
          <Route path="/" element={<ListPage />} />
          {/* URL에 /playlists 로 접근해도 동일 페이지 활용 */}
          <Route path="/playlists" element={<ListPage />} />

          {/* 플레이리스트 상세 페이지 */}
          <Route path="/playlists/:id" element={<DetailPage />} />

          {/* 잘못된 주소는 홈으로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
