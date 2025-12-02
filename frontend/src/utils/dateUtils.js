// 날짜 포맷팅 유틸리티 - 한국 시간대 기준

/**
 * Date 객체를 YYYY-MM-DD 형식의 로컬 날짜 문자열로 변환
 * @param {Date} date - 변환할 Date 객체
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
 */
export const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Date 객체를 YYYY-MM 형식의 로컬 월 문자열로 변환
 * @param {Date} date - 변환할 Date 객체
 * @returns {string} YYYY-MM 형식의 월 문자열
 */
export const formatLocalMonth = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};

/**
 * Date 객체를 YYYY-MM-DD HH:mm:ss 형식의 로컬 날짜시간 문자열로 변환
 * @param {Date} date - 변환할 Date 객체
 * @returns {string} YYYY-MM-DD HH:mm:ss 형식의 날짜시간 문자열
 */
export const formatLocalDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * 문자열에서 로컬 Date 객체 생성 (타임존 이슈 방지)
 * @param {string} dateString - YYYY-MM-DD 형식의 날짜 문자열
 * @returns {Date} 로컬 시간대의 Date 객체
 */
export const parseLocalDate = (dateString) => {
    return new Date(dateString + 'T00:00:00');
};

/**
 * 현재 날짜를 YYYY-MM-DD 형식으로 반환
 * @returns {string} 현재 날짜 문자열
 */
export const getCurrentLocalDate = () => {
    return formatLocalDate(new Date());
};

/**
 * 현재 월을 YYYY-MM 형식으로 반환
 * @returns {string} 현재 월 문자열
 */
export const getCurrentLocalMonth = () => {
    return formatLocalMonth(new Date());
};
