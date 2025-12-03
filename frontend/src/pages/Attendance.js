import React, { useState, useEffect } from 'react';
import { attendanceAPI, studentAPI } from '../services/api';
import { FiCalendar, FiList, FiCheck, FiX, FiDownload } from 'react-icons/fi';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { formatLocalDate } from '../utils/dateUtils';
import * as XLSX from 'xlsx';
import './Common.css';
import './Attendance.css';

function Attendance() {
    const [view, setView] = useState('list');
    const [students, setStudents] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [showAbsenceModal, setShowAbsenceModal] = useState(false);
    const [absenceReason, setAbsenceReason] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [monthAttendances, setMonthAttendances] = useState([]);

    useEffect(() => {
        fetchStudents();
        fetchAttendances();
    }, [selectedDate]);

    useEffect(() => {
        if (view === 'calendar') {
            fetchMonthAttendances();
        }
    }, [selectedDate, view]);

    const fetchStudents = async () => {
        try {
            const response = await studentAPI.getActive();
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const fetchAttendances = async () => {
        try {
            const dateStr = formatLocalDate(selectedDate);
            const response = await attendanceAPI.getByDate(dateStr);
            setAttendances(response.data);
        } catch (error) {
            console.error('Error fetching attendances:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMonthAttendances = async () => {
        try {
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1;
            const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
            const lastDay = new Date(year, month, 0).getDate();
            const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

            const response = await attendanceAPI.getByRange(startDate, endDate);
            setMonthAttendances(response.data);
        } catch (error) {
            console.error('Error fetching month attendances:', error);
        }
    };

    const getDayOfWeek = (date) => {
        const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        return days[date.getDay()];
    };

    const getExpectedStudents = (date = selectedDate) => {
        const dayOfWeek = getDayOfWeek(date);
        return students.filter(student => student[dayOfWeek] === true);
    };

    const getAttendanceStatus = (studentId) => {
        return attendances.find(a => a.studentId === studentId);
    };

    const getAttendanceCountForDate = (date) => {
        const dateStr = formatLocalDate(date);
        const dayAttendances = monthAttendances.filter(a => a.attendanceDate === dateStr && a.isPresent);
        return dayAttendances.length;
    };

    const getExpectedCountForDate = (date) => {
        return getExpectedStudents(date).length;
    };

    const handleAttendanceToggle = async (student, isPresent) => {
        try {
            const existing = getAttendanceStatus(student.id);

            if (!isPresent) {
                setSelectedStudent(student);
                setShowAbsenceModal(true);
                return;
            }

            const attendanceData = {
                studentId: student.id,
                attendanceDate: formatLocalDate(selectedDate),
                isPresent: true,
                progressMemo: '',
                absenceReason: null
            };

            if (existing) {
                attendanceData.id = existing.id;
            }

            await attendanceAPI.createOrUpdate(attendanceData);
            fetchAttendances();
            if (view === 'calendar') {
                fetchMonthAttendances();
            }
        } catch (error) {
            console.error('Error marking attendance:', error);
            alert('출석 처리 중 오류가 발생했습니다.');
        }
    };

    const handleAbsenceSubmit = async () => {
        if (!selectedStudent) return;

        try {
            const attendanceData = {
                studentId: selectedStudent.id,
                attendanceDate: formatLocalDate(selectedDate),
                isPresent: false,
                progressMemo: '',
                absenceReason: absenceReason
            };

            await attendanceAPI.createOrUpdate(attendanceData);
            fetchAttendances();
            if (view === 'calendar') {
                fetchMonthAttendances();
            }
            setShowAbsenceModal(false);
            setAbsenceReason('');
            setSelectedStudent(null);
        } catch (error) {
            console.error('Error marking absence:', error);
            alert('결석 처리 중 오류가 발생했습니다.');
        }
    };

    const exportCalendarToExcel = () => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;
        const lastDay = new Date(year, month, 0).getDate();
        const firstDayObj = new Date(year, month - 1, 1);
        const startDayOfWeek = firstDayObj.getDay(); // 0 = 일요일

        // 엑셀 데이터 준비
        const excelData = [];

        // 제목 행
        excelData.push([`${year}년 ${month}월 출석부`]);
        excelData.push([]); // 빈 행

        // 요일 헤더
        const weekdayHeader = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        excelData.push(weekdayHeader);

        // 달력 데이터 생성
        let currentDay = 1;
        let weekRow = [];

        // 첫 주 - 시작 요일까지 빈 칸 채우기
        for (let i = 0; i < startDayOfWeek; i++) {
            weekRow.push('');
        }

        // 날짜 채우기
        while (currentDay <= lastDay) {
            const date = new Date(year, month - 1, currentDay);
            const dateStr = formatLocalDate(date);
            const dayOfWeek = date.getDay();
            const dayName = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][dayOfWeek];

            // 해당 날짜에 출석해야 하는 학생들 찾기
            const expectedStudentsForDay = students.filter(s => s.status === 'ACTIVE' && s[dayName]);
            const dayAttendances = monthAttendances.filter(a => a.attendanceDate === dateStr);

            // 날짜 셀 내용 생성 (날짜 + 줄바꿈 + 학생 명단)
            let cellContent = `${currentDay}일`;

            if (expectedStudentsForDay.length > 0) {
                expectedStudentsForDay.forEach(student => {
                    const attendance = dayAttendances.find(a => a.studentId === student.id);
                    let status = '미체크'; // 기본값
                    if (attendance) {
                        status = attendance.isPresent ? 'O' : 'X';
                    }
                    // 줄바꿈 문자를 사용하여 한 셀에 여러 줄 표시
                    cellContent += `\n${student.name} (${status})`;
                });
            } else {
                // 출석 대상이 없는 경우 날짜만 표시하거나 표시 생략
            }

            weekRow.push(cellContent);

            // 토요일(6)이거나 마지막 날이면 행 추가
            if (dayOfWeek === 6 || currentDay === lastDay) {
                // 마지막 주의 남은 빈 칸 채우기
                while (weekRow.length < 7) {
                    weekRow.push('');
                }
                excelData.push(weekRow);
                weekRow = [];
            }

            currentDay++;
        }

        // 엑셀 워크시트 생성
        const worksheet = XLSX.utils.aoa_to_sheet(excelData);

        // 셀 스타일 및 병합 설정
        // 제목 행 병합 (A1:G1)
        if (!worksheet['!merges']) worksheet['!merges'] = [];
        worksheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } });

        // 열 너비 설정 (모든 열 넓게)
        const colWidths = Array(7).fill({ wch: 20 });
        worksheet['!cols'] = colWidths;

        // 행 높이 설정
        // 제목(30), 빈행(default), 요일(20), 날짜행들(100 - 내용이 많을 수 있으므로 높게)
        const rowHeights = [
            { hpt: 30 }, // 제목
            { hpt: 15 }, // 빈 행
            { hpt: 20 }, // 요일 헤더
        ];

        // 데이터 행 높이 추가
        const dataRowCount = excelData.length - 3; // 제목, 빈행, 요일헤더 제외
        for (let i = 0; i < dataRowCount; i++) {
            rowHeights.push({ hpt: 120 }); // 날짜 셀 높이
        }
        worksheet['!rows'] = rowHeights;

        // 정렬 스타일은 무료 버전 xlsx 라이브러리에서 적용되지 않을 수 있지만, 
        // 줄바꿈(\n)은 텍스트 랩핑이 활성화된 뷰어에서 보일 것임.

        // 워크북 생성 및 저장
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `${year}년 ${month}월`);

        // 파일 다운로드
        XLSX.writeFile(workbook, `출석부_${year}년_${month}월_달력형.xlsx`);
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const expectedStudentsForDate = getExpectedStudents(date);
            const expected = expectedStudentsForDate.length;
            const attended = getAttendanceCountForDate(date);
            const dateStr = formatLocalDate(date);

            if (expected > 0) {
                // 해당 날짜의 출석 기록 가져오기
                const dayAttendances = monthAttendances.filter(a => a.attendanceDate === dateStr);

                return (
                    <div className="calendar-tile-content">
                        <span className={attended === expected ? 'all-attended' : attended > 0 ? 'partial-attended' : 'none-attended'}>
                            {attended}/{expected}
                        </span>
                        <div className="student-names">
                            {expectedStudentsForDate.map((student, index) => {
                                // 해당 학생의 출석 여부 확인
                                const studentAttendance = dayAttendances.find(a => a.studentId === student.id);
                                const isPresent = studentAttendance && studentAttendance.isPresent;

                                return (
                                    <span
                                        key={student.id}
                                        className={`student-name ${isPresent ? 'attended' : 'not-attended'}`}
                                    >
                                        {student.name}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                );
            }
        }
        return null;
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            let classes = '';

            if (isToday) classes += 'today-tile ';
            if (isSelected) classes += 'selected-tile ';

            // 요일별 색상 클래스 추가
            const day = date.getDay();
            if (day === 0) classes += 'sunday-tile '; // 일요일
            if (day === 6) classes += 'saturday-tile '; // 토요일

            return classes.trim();
        }
        return '';
    };

    const expectedStudents = getExpectedStudents();
    const presentCount = expectedStudents.filter(s => {
        const att = getAttendanceStatus(s.id);
        return att && att.isPresent;
    }).length;

    if (loading) return <div className="loading">로딩중...</div>;

    return (
        <div className="container">
            <div className="page-header">
                <h1>출석 관리</h1>
                <p>학생 출석 기록 및 진도 관리</p>
            </div>

            <div className="card">
                <div className="filter-section">
                    <div className="tabs" style={{ borderBottom: 'none' }}>
                        <button
                            className={`tab ${view === 'list' ? 'active' : ''}`}
                            onClick={() => setView('list')}
                        >
                            <FiList /> 리스트형
                        </button>
                        <button
                            className={`tab ${view === 'calendar' ? 'active' : ''}`}
                            onClick={() => setView('calendar')}
                        >
                            <FiCalendar /> 캘린더형
                        </button>
                    </div>
                    {view === 'list' && (
                        <div className="filter-group">
                            <label>날짜:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={formatLocalDate(selectedDate)}
                                onChange={(e) => {
                                    console.log('📅 Input date selected:', e.target.value);
                                    const newDate = new Date(e.target.value + 'T00:00:00');
                                    console.log('📅 New date object:', newDate);
                                    console.log('📅 Local date string:', formatLocalDate(newDate));
                                    setSelectedDate(newDate);
                                }}
                            />
                        </div>
                    )}
                </div>

                {view === 'list' && (
                    <>
                        <div className="summary-cards">
                            <div className="summary-card small">
                                <h4>출석 대상</h4>
                                <p className="count">{expectedStudents.length}명</p>
                            </div>
                            <div className="summary-card small">
                                <h4>출석</h4>
                                <p className="count">{presentCount}명</p>
                            </div>
                            <div className="summary-card small">
                                <h4>결석</h4>
                                <p className="count danger">{expectedStudents.length - presentCount}명</p>
                            </div>
                        </div>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>이름</th>
                                        <th>학교</th>
                                        <th>출석 상태</th>
                                        <th>결석 사유</th>
                                        <th>관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expectedStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="empty-state">
                                                {getDayOfWeek(selectedDate) === 'sun' || getDayOfWeek(selectedDate) === 'sat'
                                                    ? '주말에는 출석 대상 학생이 없습니다'
                                                    : '출석 대상 학생이 없습니다'}
                                            </td>
                                        </tr>
                                    ) : (
                                        expectedStudents.map(student => {
                                            const attendance = getAttendanceStatus(student.id);
                                            return (
                                                <tr key={student.id}>
                                                    <td>{student.name}</td>
                                                    <td>{student.school || '-'}</td>
                                                    <td>
                                                        {attendance ? (
                                                            attendance.isPresent ? (
                                                                <span className="badge status-active">출석</span>
                                                            ) : (
                                                                <span className="badge status-withdrawn">결석</span>
                                                            )
                                                        ) : (
                                                            <span className="badge status-suspended">미체크</span>
                                                        )}
                                                    </td>
                                                    <td>{attendance && !attendance.isPresent ? attendance.absenceReason : '-'}</td>
                                                    <td>
                                                        <div className="actions">
                                                            <button
                                                                className="action-btn primary-btn"
                                                                onClick={() => handleAttendanceToggle(student, true)}
                                                                disabled={attendance && attendance.isPresent}
                                                            >
                                                                <FiCheck /> 출석
                                                            </button>
                                                            <button
                                                                className="action-btn delete-btn"
                                                                onClick={() => handleAttendanceToggle(student, false)}
                                                                disabled={attendance && !attendance.isPresent}
                                                            >
                                                                <FiX /> 결석
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {view === 'calendar' && (
                    <div className="calendar-view">
                        <Calendar
                            onChange={(date) => {
                                console.log('🗓️ Calendar date clicked (raw):', date);
                                // 날짜를 로컬 시간대로 정규화
                                const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                                console.log('🗓️ Normalized date:', normalizedDate);
                                console.log('🗓️ ISO string:', normalizedDate.toISOString().split('T')[0]);
                                setSelectedDate(normalizedDate);
                                setView('list');
                            }}
                            value={selectedDate}
                            tileContent={tileContent}
                            tileClassName={tileClassName}
                            locale="ko-KR"
                        />
                        <div className="calendar-legend">
                            <div className="legend-item">
                                <span className="legend-color all-attended"></span>
                                <span>전원 출석</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-color partial-attended"></span>
                                <span>일부 출석</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-color none-attended"></span>
                                <span>미출석</span>
                            </div>
                        </div>
                        <p className="calendar-hint">날짜를 클릭하면 해당 날짜의 출석 관리로 이동합니다.</p>
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <button className="btn btn-primary" onClick={exportCalendarToExcel}>
                                <FiDownload /> 캘린더형 엑셀 다운로드
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 결석 사유 입력 모달 */}
            {showAbsenceModal && (
                <div className="modal-overlay" onClick={() => setShowAbsenceModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2>결석 사유 입력</h2>
                            <button className="close-btn" onClick={() => setShowAbsenceModal(false)}>
                                <FiX />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>학생: {selectedStudent?.name}</label>
                            </div>
                            <div className="form-group">
                                <label>결석 사유 *</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={absenceReason}
                                    onChange={(e) => setAbsenceReason(e.target.value)}
                                    placeholder="결석 사유를 입력하세요 (예: 감기, 가족 행사 등)"
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowAbsenceModal(false)}>
                                취소
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleAbsenceSubmit}
                                disabled={!absenceReason.trim()}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Attendance;
