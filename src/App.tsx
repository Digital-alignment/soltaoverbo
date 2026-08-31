import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import InstallPromptPopup from './components/InstallPromptPopup';
import { useInstallPrompt } from './hooks/useInstallPrompt';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import WritingExercises from './pages/WritingExercises';
import NossaFogueira from './pages/NossaFogueira';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Admin from './pages/Admin';
import AboutUs from './pages/AboutUs';
import Programs from './pages/Programs';
import Programa21Dias from './pages/Programa21Dias';
import ProgramaCiclo from './pages/ProgramaCiclo';
import ProgramaCafeComLetras from './pages/ProgramaCafeComLetras';
import RoteiroOriginal from './pages/RoteiroOriginal';
import CheckoutSuccess from './pages/CheckoutSuccess';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

function AppContent() {
  const { showPrompt, isIOS, isAndroid, handleInstall, handleDismiss } = useInstallPrompt();

  return (
    <>
      <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/programs" element={<Programs />} />
          
          {/* Páginas de Produtos / Programas */}
          <Route path="/programas/21-dias-de-escrita" element={<Programa21Dias />} />
          <Route path="/programas/ciclo-de-aprofundamento" element={<ProgramaCiclo />} />
          <Route path="/programas/cafe-com-letras" element={<ProgramaCafeComLetras />} />
          
          {/* Alias de rotas curtas */}
          <Route path="/21-dias-de-escrita" element={<Programa21Dias />} />
          <Route path="/ciclo-de-aprofundamento" element={<ProgramaCiclo />} />
          <Route path="/cafe-com-letras" element={<ProgramaCafeComLetras />} />

          <Route path="/roteirooriginal" element={<RoteiroOriginal />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/course/:courseId"
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/exercises"
            element={
              <ProtectedRoute>
                <WritingExercises />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fogueira"
            element={
              <ProtectedRoute>
                <NossaFogueira />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect to Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* PWA Install Prompt Banner */}
      {showPrompt && (
        <InstallPromptPopup
          isIOS={isIOS}
          isAndroid={isAndroid}
          onInstall={handleInstall}
          onDismiss={handleDismiss}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
