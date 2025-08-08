import React from 'react';

const NotFound = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div style={{ 
      padding: '40px 20px', 
      textAlign: 'center', 
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* 404 Animation/Icon */}
      <div style={{ 
        fontSize: '8rem', 
        marginBottom: '20px',
        color: '#e74c3c',
        animation: 'bounce 2s infinite'
      }}>
        🤔
      </div>

      {/* 404 Number */}
      <h1 style={{ 
        fontSize: '6rem', 
        color: '#2c3e50', 
        marginBottom: '20px',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}>
        ৪০ৄ
      </h1>

      {/* Error Message */}
      <h2 style={{ 
        fontSize: '2rem', 
        color: '#34495e', 
        marginBottom: '15px',
        fontWeight: 'normal'
      }}>
        পেজটি পাওয়া যায়নি!
      </h2>

      <p style={{ 
        fontSize: '1.2rem', 
        color: '#7f8c8d', 
        marginBottom: '30px',
        lineHeight: '1.6',
        maxWidth: '500px'
      }}>
        দুঃখিত! আপনি যে পেজটি খুঁজছেন তা আর এই ঠিকানায় নেই। 
        হয়তো লিংকটি ভুল অথবা পেজটি অন্য কোথাও সরিয়ে ফেলা হয়েছে।
      </p>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '40px'
      }}>
        <button
          onClick={handleGoHome}
          style={{
            padding: '15px 30px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🏠 হোম পেজে যান
        </button>

        <button
          onClick={handleGoBack}
          style={{
            padding: '15px 30px',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ⬅️ পেছনে যান
        </button>
      </div>

      {/* Helpful Links */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '30px', 
        borderRadius: '12px',
        border: '1px solid #e9ecef',
        width: '100%',
        maxWidth: '600px'
      }}>
        <h3 style={{ 
          color: '#2c3e50', 
          marginBottom: '20px',
          fontSize: '1.3rem'
        }}>
          আপনি হয়তো এগুলো খুঁজছেন:
        </h3>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px' 
        }}>
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#2c3e50',
              border: '1px solid #dee2e6',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>🏠</span>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem' }}>হোম পেজ</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6c757d' }}>মূল পেজে ফিরে যান</p>
            </div>
          </a>

          <a
            href="/courses"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#2c3e50',
              border: '1px solid #dee2e6',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>📚</span>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem' }}>কোর্সসমূহ</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6c757d' }}>সব কোর্স দেখুন</p>
            </div>
          </a>

          <a
            href="/about"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#2c3e50',
              border: '1px solid #dee2e6',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>ℹ️</span>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem' }}>আমাদের সম্পর্কে</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6c757d' }}>প্ল্যাটফর্ম সম্পর্কে জানুন</p>
            </div>
          </a>

          <a
            href="/contact"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#2c3e50',
              border: '1px solid #dee2e6',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>📞</span>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem' }}>যোগাযোগ</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6c757d' }}>সাহায্যের জন্য যোগাযোগ করুন</p>
            </div>
          </a>
        </div>
      </div>

      {/* Fun Fact */}
      <div style={{ 
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#e8f4fd',
        borderRadius: '8px',
        border: '1px solid #bee5eb',
        maxWidth: '500px'
      }}>
        <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>💡 জানেন কি?</h4>
        <p style={{ color: '#6c757d', fontSize: '0.9rem', margin: 0 }}>
          ৪০৪ এরর কোডটি "পেজ পাওয়া যায়নি" বোঝাতে ব্যবহার করা হয়। এটি একটি HTTP স্ট্যাটাস কোড 
          যা ১৯৯০ সাল থেকে ব্যবহার হয়ে আসছে!
        </p>
      </div>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default NotFound;