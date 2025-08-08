import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    alert('আপনার বার্তা পাঠানো হয়েছে! আমরা শীঘ্রই উত্তর দেব।');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '15px' }}>
          যোগাযোগ করুন
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#7f8c8d' }}>
          আমাদের সাথে যোগাযোগ করুন - আমরা সাহায্য করতে প্রস্তুত
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
        {/* Contact Form */}
        <div>
          <h2 style={{ color: '#2980b9', marginBottom: '20px' }}>বার্তা পাঠান</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                color: '#34495e',
                fontWeight: 'bold'
              }}>
                নাম *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="আপনার নাম লিখুন"
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                color: '#34495e',
                fontWeight: 'bold'
              }}>
                ইমেইল *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="আপনার ইমেইল ঠিকানা"
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                color: '#34495e',
                fontWeight: 'bold'
              }}>
                বিষয়
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">বিষয় নির্বাচন করুন</option>
                <option value="course-inquiry">কোর্স সম্পর্কে জানতে চাই</option>
                <option value="technical-support">টেকনিক্যাল সাপোর্ট</option>
                <option value="payment-issue">পেমেন্ট সমস্যা</option>
                <option value="feedback">মতামত ও পরামর্শ</option>
                <option value="partnership">পার্টনারশিপ</option>
                <option value="other">অন্যান্য</option>
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                color: '#34495e',
                fontWeight: 'bold'
              }}>
                বার্তা *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="6"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
                placeholder="আপনার বার্তা বিস্তারিত লিখুন..."
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '15px 30px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
            >
              বার্তা পাঠান
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div>
          <h2 style={{ color: '#27ae60', marginBottom: '20px' }}>যোগাযোগের তথ্য</h2>
          
          <div style={{ marginBottom: '30px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '15px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '1.5rem', marginRight: '15px' }}>📧</span>
              <div>
                <h4 style={{ margin: 0, color: '#2c3e50' }}>ইমেইল</h4>
                <p style={{ margin: 0, color: '#7f8c8d' }}>support@sohojgonit.com</p>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '15px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '1.5rem', marginRight: '15px' }}>📞</span>
              <div>
                <h4 style={{ margin: 0, color: '#2c3e50' }}>ফোন</h4>
                <p style={{ margin: 0, color: '#7f8c8d' }}>+৮৮০ ১৭১২-৩৪৫৬৭৮</p>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '15px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '1.5rem', marginRight: '15px' }}>📍</span>
              <div>
                <h4 style={{ margin: 0, color: '#2c3e50' }}>ঠিকানা</h4>
                <p style={{ margin: 0, color: '#7f8c8d' }}>
                  ১২৩/এ, ধানমন্ডি<br />
                  ঢাকা-১২০৫, বাংলাদেশ
                </p>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div style={{ 
            backgroundColor: '#e8f5e8', 
            padding: '20px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#27ae60', marginBottom: '15px' }}>অফিস সময়</h3>
            <div style={{ color: '#2c3e50' }}>
              <p style={{ margin: '5px 0' }}>রবিবার - বৃহস্পতিবার: ৯:০০ - ১৮:০০</p>
              <p style={{ margin: '5px 0' }}>শুক্রবার: ৯:০০ - ১২:০০</p>
              <p style={{ margin: '5px 0' }}>শনিবার: বন্ধ</p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 style={{ color: '#8e44ad', marginBottom: '15px' }}>সোশ্যাল মিডিয়া</h3>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#3b5998',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}>
                f
              </div>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#1da1f2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}>
                🐦
              </div>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#25d366',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}>
                📱
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ marginTop: '50px', padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px', textAlign: 'center' }}>
          সচরাচর জিজ্ঞাসিত প্রশ্ন
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div>
            <h4 style={{ color: '#34495e', marginBottom: '10px' }}>কোর্সের মূল্য কী?</h4>
            <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              আমাদের কোর্সের মূল্য ৫০০ থেকে ২৫০০ টাকা পর্যন্ত। কিছু কোর্স সম্পূর্ণ বিনামূল্যে।
            </p>
          </div>
          <div>
            <h4 style={{ color: '#34495e', marginBottom: '10px' }}>কোর্স কত দিনের জন্য অ্যাক্সেস পাব?</h4>
            <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              একবার এনরোল করলে আজীবনের জন্য কোর্স অ্যাক্সেস পাবেন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;