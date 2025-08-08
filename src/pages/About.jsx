import React from 'react';

const About = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '15px' }}>
          আমাদের সম্পর্কে
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#7f8c8d' }}>
          সহজ গণিত - একটি আধুনিক গণিত শিক্ষা প্ল্যাটফর্ম
        </p>
      </div>

      {/* Mission Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#2980b9', marginBottom: '20px', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>
          আমাদের লক্ষ্য
        </h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#555', marginBottom: '15px' }}>
          সহজ গণিত প্ল্যাটফর্মের মূল লক্ষ্য হলো গণিত শিক্ষাকে সবার জন্য সহজ, বোধগম্য এবং আনন্দদায়ক করে তোলা। 
          আমরা বিশ্বাস করি যে প্রযুক্তির সাহায্যে গণিত শেখা যায় আরও কার্যকরভাবে।
        </p>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#555' }}>
          আমাদের ইন্টারেক্টিভ কোর্স, ভিডিও টিউটোরিয়াল এবং অনুশীলনীর মাধ্যমে শিক্ষার্থীরা নিজের গতিতে 
          গণিত শিখতে পারবেন।
        </p>
      </div>

      {/* Features Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#27ae60', marginBottom: '20px', borderBottom: '2px solid #2ecc71', paddingBottom: '10px' }}>
          আমাদের বৈশিষ্ট্য
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
            <h4 style={{ color: '#495057', marginBottom: '10px' }}>🎓 বাংলা ভাষায় শিক্ষা</h4>
            <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              সম্পূর্ণ বাংলা ভাষায় গণিত কোর্স এবং টিউটোরিয়াল।
            </p>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
            <h4 style={{ color: '#495057', marginBottom: '10px' }}>📱 মোবাইল ফ্রেন্ডলি</h4>
            <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              যেকোনো ডিভাইস থেকে সহজেই অ্যাক্সেস করুন।
            </p>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
            <h4 style={{ color: '#495057', marginBottom: '10px' }}>⚡ দ্রুত শিক্ষা</h4>
            <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              কার্যকর পদ্ধতিতে দ্রুত গণিত শিখুন।
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#e74c3c', marginBottom: '20px', borderBottom: '2px solid #e74c3c', paddingBottom: '10px' }}>
          আমাদের টিম
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: '#3498db', 
              borderRadius: '50%', 
              margin: '0 auto 15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: 'white'
            }}>
              👨‍🏫
            </div>
            <h4 style={{ color: '#2c3e50', marginBottom: '5px' }}>মোঃ রহিম উদ্দিন</h4>
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>প্রধান শিক্ষক</p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: '#e74c3c', 
              borderRadius: '50%', 
              margin: '0 auto 15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: 'white'
            }}>
              👩‍💻
            </div>
            <h4 style={{ color: '#2c3e50', marginBottom: '5px' }}>সালমা খাতুন</h4>
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>কন্টেন্ট ডেভেলপার</p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: '#27ae60', 
              borderRadius: '50%', 
              margin: '0 auto 15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: 'white'
            }}>
              👨‍💻
            </div>
            <h4 style={{ color: '#2c3e50', marginBottom: '5px' }}>করিম আহমেদ</h4>
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>টেক লিড</p>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div style={{ 
        textAlign: 'center', 
        backgroundColor: '#e8f4fd', 
        padding: '30px', 
        borderRadius: '8px',
        border: '1px solid #bee5eb'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>যোগাযোগ করুন</h3>
        <p style={{ color: '#6c757d', marginBottom: '20px' }}>
          আমাদের সাথে যোগাযোগ করতে চান? আমরা সর্বদা আপনার সেবায় নিয়োজিত।
        </p>
        <button style={{
          padding: '12px 24px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          যোগাযোগ করুন
        </button>
      </div>
    </div>
  );
};

export default About;