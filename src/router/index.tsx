import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthGate from "@/components/auth/AuthGate";
import Layout from "@/components/layout/Layout";
import HomePage from "@/components/HomePage";
import ListPage from "@/features/playlists/pages/ListPage";
import DetailPage from "@/features/playlists/pages/DetailPage";
import StreamsListPage from "@/features/streams/pages/StreamsListPage";
import StreamPlayerPage from "@/features/streams/pages/StreamPlayerPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthGate>
        <Layout>
          <Routes>
            {/* 루트 → HomePage (영상 + 스트림) */}
            <Route path="/" element={<HomePage />} />
            {/* URL에 /playlists 로 접근하면 영상만 */}
            <Route path="/playlists" element={<ListPage />} />

            {/* 플레이리스트 상세 페이지 */}
            <Route path="/playlists/:id" element={<DetailPage />} />

            {/* 스트림 페이지들 */}
            <Route path="/streams" element={<StreamsListPage />} />
            <Route path="/streams/:id" element={<StreamPlayerPage />} />

            {/* 잘못된 주소는 홈으로 리다이렉트 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthGate>
    </BrowserRouter>
  );
}
