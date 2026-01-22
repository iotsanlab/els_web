import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ResetPasswordModal from "../../components/Modal/ResetPasswordModal";

const ResetPasswordPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const rawLink = searchParams.get("link");
    if (rawLink) {
      setIsModalOpen(true);
      const decodedLink = decodeURIComponent(rawLink);
      const innerUrl = new URL(decodedLink);
      const token = innerUrl.searchParams.get("resetToken");
      setResetToken(token);
    } else {
      setIsModalOpen(false);
    }
  }, [searchParams]);

  return (
    <ResetPasswordModal
      isOpen={isModalOpen}
      onClose={closeModal}
      token={resetToken}
    />
  );
};

export default ResetPasswordPage;
