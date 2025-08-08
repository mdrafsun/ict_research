import React from 'react';

const Home = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '10px' }}>
          সহজ গণিত
        </h1>
        <h2 style={{ fontSize: '1.5rem', color: '#34495e', marginBottom: '20px' }}>
          Easy Mathematics Learning Platform
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#7f8c8d', maxWidth: '600px', margin: '0 auto' }}>
          আমাদের প্ল্যাটফর্মে স্বাগতম! গণিত শেখা এখন আরও সহজ এবং মজাদার।
        </p>
      </div>

      {/* Features Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
        <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: '#2980b9', marginBottom: '15px' }}>📚 বিভিন্ন কোর্স</h3>
          <p style={{ color: '#555' }}>
            প্রাথমিক থেকে উচ্চ মাধ্যমিক পর্যন্ত সব ধরনের গণিত কোর্স।
          </p>
        </div>
        
        <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: '#27ae60', marginBottom: '15px' }}>🎯 ইন্টারেক্টিভ শিক্ষা</h3>
          <p style={{ color: '#555' }}>
            ভিডিও, কুইজ এবং অনুশীলনের মাধ্যমে গণিত শিখুন।
          </p>
        </div>
        
        <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: '#e74c3c', marginBottom: '15px' }}>📊 অগ্রগতি ট্র্যাকিং</h3>
          <p style={{ color: '#555' }}>
            আপনার শেখার অগ্রগতি দেখুন এবং উন্নতি করুন।
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div style={{ textAlign: 'center', backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '8px' }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>আজই শুরু করুন</h3>
        <p style={{ color: '#6c757d', marginBottom: '20px' }}>
          আমাদের সাথে যোগ দিন এবং গণিতে দক্ষতা অর্জন করুন।
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            padding: '12px 24px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            কোর্স দেখুন
          </button>
          <button style={{
            padding: '12px 24px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            সাইন আপ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;