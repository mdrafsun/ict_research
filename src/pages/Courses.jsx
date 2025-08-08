import React, { useState } from 'react';

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const courses = [
    {
      id: 1,
      title: 'প্রাথমিক গণিত',
      category: 'primary',
      level: 'শুরুর স্তর',
      duration: '৪ সপ্তাহ',
      lessons: 24,
      price: 'বিনামূল্যে',
      description: 'সংখ্যা, যোগ, বিয়োগ, গুণ এবং ভাগের মূল ধারণা।',
      image: '🔢'
    },
    {
      id: 2,
      title: 'বীজগণিত - মূল ধারণা',
      category: 'algebra',
      level: 'মধ্যম স্তর',
      duration: '৬ সপ্তাহ',
      lessons: 36,
      price: '১২০০ টাকা',
      description: 'চলক, সমীকরণ এবং বীজগণিতের মূল নিয়মাবলী।',
      image: '📐'
    },
    {
      id: 3,
      title: 'জ্যামিতি ও ত্রিকোণমিতি',
      category: 'geometry',
      level: 'উচ্চ স্তর',
      duration: '৮ সপ্তাহ',
      lessons: 48,
      price: '১৮০০ টাকা',
      description: 'আকার, কোণ, ত্রিভুজ এবং বৃত্তের বিস্তারিত আলোচনা।',
      image: '📏'
    },
    {
      id: 4,
      title: 'পরিসংখ্যান ও সম্ভাবনা',
      category: 'statistics',
      level: 'উচ্চ স্তর',
      duration: '৬ সপ্তাহ',
      lessons: 30,
      price: '১৫০০ টাকা',
      description: 'ডেটা বিশ্লেষণ, গড়, মধ্যক এবং সম্ভাবনার হিসাব।',
      image: '📊'
    },
    {
      id: 5,
      title: 'ক্যালকুলাস প্রাথমিক',
      category: 'calculus',
      level: 'উচ্চ স্তর',
      duration: '১০ সপ্তাহ',
      lessons: 60,
      price: '২৫০০ টাকা',
      description: 'অন্তরকলন ও যোগজকরণের মূল ধারণা।',
      image: '∫'
    },
    {
      id: 6,
      title: 'মাধ্যমিক গণিত',
      category: 'secondary',
      level: 'মধ্যম স্তর',
      duration: '১২ সপ্তাহ',
      lessons: 72,
      price: '২০০০ টাকা',
      description: 'অষ্টম থেকে দশম শ্রেণির সম্পূর্ণ গণিত কোর্স।',
      image: '📚'
    }
  ];

  const categories = [
    { id: 'all', name: 'সব কোর্স', count: courses.length },
    { id: 'primary', name: 'প্রাথমিক', count: courses.filter(c => c.category === 'primary').length },
    { id: 'secondary', name: 'মাধ্যমিক', count: courses.filter(c => c.category === 'secondary').length },
    { id: 'algebra', name: 'বীজগণিত', count: courses.filter(c => c.category === 'algebra').length },
    { id: 'geometry', name: 'জ্যামিতি', count: courses.filter(c => c.category === 'geometry').length },
    { id: 'statistics', name: 'পরিসংখ্যান', count: courses.filter(c => c.category === 'statistics').length },
    { id: 'calculus', name: 'ক্যালকুলাস', count: courses.filter(c => c.category === 'calculus').length }
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '15px' }}>
          আমাদের কোর্সসমূহ
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#7f8c8d' }}>
          বিভিন্ন স্তরের গণিত কোর্স নির্বাচন করুন
        </p>
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#34495e', marginBottom: '15px' }}>বিভাগ অনুযায়ী ফিল্টার করুন:</h3>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '10px',
          justifyContent: 'center'
        }}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: '10px 20px',
                backgroundColor: selectedCategory === category.id ? '#3498db' : '#ecf0f1',
                color: selectedCategory === category.id ? 'white' : '#2c3e50',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '30px' 
      }}>
        {filteredCourses.map(course => (
          <div 
            key={course.id}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
          >
            {/* Course Image/Icon */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              textAlign: 'center',
              fontSize: '4rem',
              borderBottom: '1px solid #e9ecef'
            }}>
              {course.image}
            </div>

            {/* Course Content */}
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <span style={{
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  padding: '4px 12px',
                  borderRadius: '15px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {course.level}
                </span>
              </div>

              <h3 style={{ 
                color: '#2c3e50', 
                marginBottom: '10px',
                fontSize: '1.3rem'
              }}>
                {course.title}
              </h3>

              <p style={{ 
                color: '#666', 
                lineHeight: '1.5',
                marginBottom: '20px',
                fontSize: '0.95rem'
              }}>
                {course.description}
              </p>

              {/* Course Stats */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '20px',
                fontSize: '0.9rem',
                color: '#7f8c8d'
              }}>
                <span>📅 {course.duration}</span>
                <span>📖 {course.lessons} পাঠ</span>
              </div>

              {/* Price and CTA */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold',
                    color: course.price === 'বিনামূল্যে' ? '#27ae60' : '#e74c3c'
                  }}>
                    {course.price}
                  </span>
                </div>
                <button style={{
                  padding: '10px 20px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  এনরোল করুন
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No courses message */}
      {filteredCourses.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#7f8c8d'
        }}>
          <h3>এই বিভাগে কোন কোর্স পাওয়া যায়নি</h3>
          <p>অন্য বিভাগ দেখুন বা সব কোর্স দেখতে "সব কোর্স" নির্বাচন করুন।</p>
        </div>
      )}
    </div>
  );
};

export default Courses;