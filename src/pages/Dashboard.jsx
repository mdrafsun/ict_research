import React, { useState } from 'react';

const Dashboard = () => {
  // Mock user data
  const [user] = useState({
    name: 'আহমেদ হাসান',
    email: 'ahmed.hasan@email.com',
    joinDate: '১৫ জানুয়ারি, ২০২৪',
    totalCourses: 3,
    completedCourses: 1,
    totalHours: 45,
    streak: 7
  });

  const [enrolledCourses] = useState([
    {
      id: 1,
      title: 'প্রাথমিক গণিত',
      progress: 100,
      totalLessons: 24,
      completedLessons: 24,
      lastAccessed: '২ দিন আগে',
      status: 'completed',
      image: '🔢'
    },
    {
      id: 2,
      title: 'বীজগণিত - মূল ধারণা',
      progress: 65,
      totalLessons: 36,
      completedLessons: 23,
      lastAccessed: 'আজ',
      status: 'in_progress',
      image: '📐'
    },
    {
      id: 3,
      title: 'জ্যামিতি ও ত্রিকোণমিতি',
      progress: 15,
      totalLessons: 48,
      completedLessons: 7,
      lastAccessed: '৫ দিন আগে',
      status: 'in_progress',
      image: '📏'
    }
  ]);

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'lesson_completed',
      title: 'সমীকরণ সমাধান - পাঠ ২৩',
      course: 'বীজগণিত - মূল ধারণা',
      time: '২ ঘন্টা আগে',
      icon: '✅'
    },
    {
      id: 2,
      type: 'quiz_passed',
      title: 'বীজগণিত কুইজ - ৪',
      course: 'বীজগণিত - মূল ধারণা',
      time: '৩ ঘন্টা আগে',
      icon: '🎯'
    },
    {
      id: 3,
      type: 'course_completed',
      title: 'প্রাথমিক গণিত সম্পূর্ণ',
      course: 'প্রাথমিক গণিত',
      time: '২ দিন আগে',
      icon: '🏆'
    },
    {
      id: 4,
      type: 'lesson_completed',
      title: 'যোগ-বিয়োগের নিয়ম',
      course: 'প্রাথমিক গণিত',
      time: '৩ দিন আগে',
      icon: '✅'
    }
  ]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Welcome Section */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '10px' }}>
          স্বাগতম, {user.name}! 👋
        </h1>
        <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>
          আপনার শেখার যাত্রা চালিয়ে যান
        </p>
      </div>

      {/* Statistics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          backgroundColor: '#3498db',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📚</div>
          <h3 style={{ margin: 0, fontSize: '2rem' }}>{user.totalCourses}</h3>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>মোট কোর্স</p>
        </div>

        <div style={{
          backgroundColor: '#27ae60',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>✅</div>
          <h3 style={{ margin: 0, fontSize: '2rem' }}>{user.completedCourses}</h3>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>সম্পূর্ণ কোর্স</p>
        </div>

        <div style={{
          backgroundColor: '#e74c3c',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⏰</div>
          <h3 style={{ margin: 0, fontSize: '2rem' }}>{user.totalHours}</h3>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>ঘন্টা পড়াশোনা</p>
        </div>

        <div style={{
          backgroundColor: '#f39c12',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔥</div>
          <h3 style={{ margin: 0, fontSize: '2rem' }}>{user.streak}</h3>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>দিনের স্ট্রিক</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        {/* Enrolled Courses */}
        <div>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>
            আমার কোর্সসমূহ
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {enrolledCourses.map(course => (
              <div key={course.id} style={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '20px',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ fontSize: '2rem', marginRight: '15px' }}>
                    {course.image}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '1.2rem' }}>
                      {course.title}
                    </h3>
                    <p style={{ margin: '5px 0 0 0', color: '#7f8c8d', fontSize: '0.9rem' }}>
                      শেষ দেখা: {course.lastAccessed}
                    </p>
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    backgroundColor: course.status === 'completed' ? '#d4edda' : '#fff3cd',
                    color: course.status === 'completed' ? '#155724' : '#856404'
                  }}>
                    {course.status === 'completed' ? 'সম্পূর্ণ' : 'চলমান'}
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>
                      অগ্রগতি: {course.completedLessons}/{course.totalLessons} পাঠ
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2c3e50' }}>
                      {course.progress}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#ecf0f1',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${course.progress}%`,
                      height: '100%',
                      backgroundColor: course.progress === 100 ? '#27ae60' : '#3498db',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{
                    padding: '8px 16px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}>
                    {course.status === 'completed' ? 'পুনরায় দেখুন' : 'চালিয়ে যান'}
                  </button>
                  <button style={{
                    padding: '8px 16px',
                    backgroundColor: '#ecf0f1',
                    color: '#2c3e50',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}>
                    বিস্তারিত
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button style={{
              padding: '12px 24px',
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              + নতুন কোর্স যোগ করুন
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Recent Activity */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>সাম্প্রতিক কার্যকলাপ</h3>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px', 
              padding: '15px',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {recentActivities.map(activity => (
                <div key={activity.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px',
                  padding: '10px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ fontSize: '1.2rem', marginRight: '10px' }}>
                    {activity.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold', color: '#2c3e50' }}>
                      {activity.title}
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#6c757d' }}>
                      {activity.course}
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#adb5bd' }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>দ্রুত কাজ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button style={{
                padding: '12px',
                backgroundColor: 'white',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.9rem'
              }}>
                <span style={{ marginRight: '10px' }}>📊</span>
                অগ্রগতি রিপোর্ট দেখুন
              </button>
              <button style={{
                padding: '12px',
                backgroundColor: 'white',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.9rem'
              }}>
                <span style={{ marginRight: '10px' }}>📝</span>
                কুইজ অনুশীলন করুন
              </button>
              <button style={{
                padding: '12px',
                backgroundColor: 'white',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.9rem'
              }}>
                <span style={{ marginRight: '10px' }}>⚙️</span>
                সেটিংস পরিবর্তন করুন
              </button>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>অর্জনসমূহ</h3>
            <div style={{ 
              backgroundColor: '#fff3cd', 
              padding: '15px', 
              borderRadius: '8px',
              border: '1px solid #ffeaa7'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>🏆</span>
                <div>
                  <h4 style={{ margin: 0, color: '#856404' }}>প্রথম কোর্স সম্পূর্ণ</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#856404' }}>
                    প্রাথমিক গণিত কোর্স সম্পূর্ণ করেছেন
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>🔥</span>
                <div>
                  <h4 style={{ margin: 0, color: '#856404' }}>সপ্তাহব্যাপী স্ট্রিক</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#856404' }}>
                    ৭ দিন ধারাবাহিক অধ্যয়ন
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;