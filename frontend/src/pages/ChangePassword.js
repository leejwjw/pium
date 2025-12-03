import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/ChangePassword.css';

const ChangePassword = () => {
    const [username, setUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!username || !currentPassword || !newPassword || !confirmPassword) {
            setError('모든 필드를 입력해주세요.');
            return false;
        }

        if (newPassword.length < 6) {
            setError('새 비밀번호는 최소 6자 이상이어야 합니다.');
            return false;
        }

        if (newPassword === currentPassword) {
            setError('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
            return false;
        }

        if (newPassword !== confirmPassword) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await authService.changePassword(username, currentPassword, newPassword);
            setSuccess('비밀번호가 성공적으로 변경되었습니다. 3초 후 로그인 페이지로 이동합니다.');

            // 3초 후 로그인 페이지로 이동
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || '비밀번호 변경에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(-1); // 이전 페이지로 이동
    };

    return (
        <div className="change-password-container">
            <div className="change-password-card">
                <div className="change-password-header">
                    <h1>🔐 비밀번호 변경</h1>
                    <p>아이디와 현재 비밀번호로 인증 후 변경하세요</p>
                </div>

                <form onSubmit={handleSubmit} className="change-password-form">
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <div className="form-group">
                        <label htmlFor="username">아이디</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="아이디를 입력하세요"
                            disabled={loading || success}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="currentPassword">현재 비밀번호</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="현재 비밀번호를 입력하세요"
                            disabled={loading || success}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">새 비밀번호</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="새 비밀번호를 입력하세요 (최소 6자)"
                            disabled={loading || success}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">새 비밀번호 확인</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="새 비밀번호를 다시 입력하세요"
                            disabled={loading || success}
                        />
                    </div>

                    <div className="button-group">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={handleCancel}
                            disabled={loading || success}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading || success}
                        >
                            {loading ? '변경 중...' : '비밀번호 변경'}
                        </button>
                    </div>
                </form>

                <div className="change-password-footer">
                    <p className="info-text">
                        💡 로그인 없이 아이디와 현재 비밀번호로 변경 가능합니다
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
