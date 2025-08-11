import React, { useState, useEffect, useRef } from 'react';
import { 
  FaUpload, FaImage, FaCalendarAlt, FaMapMarkerAlt, FaDollarSign,
  FaTags, FaFileAlt, FaTimes, FaCheck, FaArrowLeft, FaSpinner, FaPlus,
  FaTrash, FaClock, FaEdit
} from 'react-icons/fa';
import axios from 'axios';

const SellerCreateProduct = ({ onBack }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    expiration_date: '',
    pickup_date: '',
    address: '',
    category: 'electronics'
  });

  // Rental Pricing Data
  const [rentalPricing, setRentalPricing] = useState([
    { period: 'Daily', pricelist: '', price: '' },
    { period: 'Weekly', pricelist: '', price: '' },
    { period: 'Monthly', pricelist: '', price: '' }
  ]);

  // Rental Reservation Charges
  const [reservationCharges, setReservationCharges] = useState({
    extraHour: '',
    extraDays: '',
    lateFee: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRentalPricingChange = (index, field, value) => {
    setRentalPricing(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleReservationChargeChange = (field, value) => {
    setReservationCharges(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addRentalPricingRow = () => {
    setRentalPricing(prev => [
      ...prev,
      { period: '', pricelist: '', price: '' }
    ]);
  };

  const removeRentalPricingRow = (index) => {
    if (rentalPricing.length > 1) {
      setRentalPricing(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = (files) => {
    const validFiles = Array.from(files).filter(file => {
      return file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024; // 5MB limit
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          file: file,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Product title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.expiration_date) {
      newErrors.expiration_date = 'Expiration date is required';
    }

    if (!formData.pickup_date) {
      newErrors.pickup_date = 'Pickup date is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Pickup address is required';
    }

    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Upload images to Cloudinary or your image service
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          // For demo, we'll use the local URL
          // In production, upload to Cloudinary
          return "https://res.cloudinary.com/demo/image/upload/v1620827769/sample.jpg";
        })
      );

      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        expiration_date: formData.expiration_date,
        pickup_date: formData.pickup_date,
        address: formData.address,
        images: imageUrls,
        rental_pricing: rentalPricing,
        reservation_charges: reservationCharges
      };

      console.log('Submitting product data:', productData);

      const response = await axios.post('http://localhost:8000/api/rentals/products/', productData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Product created successfully:', response.data);
      alert('Product created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        expiration_date: '',
        pickup_date: '',
        address: '',
        category: 'electronics'
      });
      setImages([]);
      setRentalPricing([
        { period: 'Daily', pricelist: '', price: '' },
        { period: 'Weekly', pricelist: '', price: '' },
        { period: 'Monthly', pricelist: '', price: '' }
      ]);
      setReservationCharges({ extraHour: '', extraDays: '', lateFee: '' });
      
      // Go back to dashboard
      if (onBack) onBack();

    } catch (error) {
      console.error('Error creating product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create product. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`create-product ${isDarkMode ? 'dark' : ''}`}>
      <style jsx>{`
        /* Landing Page Variables */
        :root {
          --blue: #3b82f6;
          --blue-deep: #1d4ed8;
          --blue-soft: #dbeafe;
          --blue-accent: #2563eb;
          --blue-bright: #60a5fa;
          --blue-light: #93c5fd;
          --teal: #4ecdc4;
          --teal-light: #7dd3db;
          --rose: #ff6b6b;
          --rose-light: #ff9999;
          --dark-bg: #0a0e15;
          --dark-card: #111827;
          --dark-card-light: #1f2937;
          --dark-text: #f8fafc;
          --dark-text-soft: #cbd5e1;
          --white-bg: #ffffff;
          --white-card: #ffffff;
          --white-text: #1e293b;
          --white-text-soft: #64748b;
          --blue-dark: #0f172a;
          --blue-dark-soft: #334155;
          --shadow-dark: 0 25px 50px rgba(0,0,0,0.4);
          --shadow-light: 0 15px 40px rgba(59,130,246,0.15);
          --shadow-blue: 0 15px 45px rgba(59,130,246,0.2);
          --blur-glass: blur(20px);
          --speed: 550ms;
          --speed-long: 850ms;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .create-product {
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          color: var(--white-text);
          min-height: 100vh;
          transition: all var(--speed-long) ease;
          scroll-behavior: smooth;
          padding: 2rem;
        }

        .create-product.dark {
          background: radial-gradient(ellipse 120% 100% at 50% 0%, #1a202c 0%, var(--dark-bg) 45%, #050810 100%);
          color: var(--dark-text);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
        }

        .main-form {
          background: var(--white-card);
          border-radius: 24px;
          box-shadow: var(--shadow-light);
          overflow: hidden;
          border: 1px solid rgba(59,130,246,0.1);
        }

        .dark .main-form {
          background: var(--dark-card);
          border-color: rgba(76,205,196,0.1);
          box-shadow: var(--shadow-dark);
        }

        .sidebar {
          background: var(--white-card);
          border-radius: 24px;
          box-shadow: var(--shadow-light);
          border: 1px solid rgba(59,130,246,0.1);
          padding: 2rem;
        }

        .dark .sidebar {
          background: var(--dark-card);
          border-color: rgba(76,205,196,0.1);
          box-shadow: var(--shadow-dark);
        }

        .header {
          padding: 2rem;
          background: linear-gradient(135deg, rgba(59,130,246,0.05), rgba(255,255,255,0.8));
          border-bottom: 1px solid rgba(59,130,246,0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .dark .header {
          background: linear-gradient(135deg, rgba(76,205,196,0.08), rgba(31,41,55,0.9));
          border-bottom-color: rgba(76,205,196,0.1);
        }

        .back-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(59,130,246,0.1);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--speed) ease;
          color: var(--blue);
        }

        .back-btn:hover {
          background: var(--blue);
          color: white;
          transform: scale(1.1);
        }

        .dark .back-btn {
          background: rgba(76,205,196,0.1);
          color: var(--teal);
        }

        .dark .back-btn:hover {
          background: var(--teal);
          color: var(--dark-bg);
        }

        .header-content h1 {
          font-size: 2rem;
          font-weight: 900;
          background: linear-gradient(135deg, var(--blue-dark), var(--blue));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .dark .header-content h1 {
          background: linear-gradient(135deg, var(--dark-text), var(--teal));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-content p {
          color: var(--white-text-soft);
        }

        .dark .header-content p {
          color: var(--dark-text-soft);
        }

        .form-container {
          padding: 2rem;
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--blue-dark);
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid rgba(59,130,246,0.1);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .dark .section-title {
          color: var(--dark-text);
          border-bottom-color: rgba(76,205,196,0.1);
        }

        .form-grid {
          display: grid;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-weight: 600;
          color: var(--blue-dark);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .dark .form-label {
          color: var(--dark-text);
        }

        .form-input,
        .form-textarea,
        .form-select {
          padding: 0.75rem 1rem;
          border: 2px solid rgba(59,130,246,0.1);
          border-radius: 12px;
          background: var(--white-bg);
          color: var(--blue-dark);
          font-family: inherit;
          transition: all var(--speed) ease;
          outline: none;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          border-color: var(--blue);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }

        .dark .form-input,
        .dark .form-textarea,
        .dark .form-select {
          background: var(--dark-card-light);
          border-color: rgba(76,205,196,0.2);
          color: var(--dark-text);
        }

        .dark .form-input:focus,
        .dark .form-textarea:focus,
        .dark .form-select:focus {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px rgba(76,205,196,0.1);
        }

        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }

        .form-error {
          color: var(--rose);
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        /* Rental Pricing Table */
        .pricing-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border: 1px solid rgba(59,130,246,0.1);
          border-radius: 12px;
          overflow: hidden;
        }

        .dark .pricing-table {
          border-color: rgba(76,205,196,0.2);
        }

        .pricing-table th,
        .pricing-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(59,130,246,0.1);
        }

        .dark .pricing-table th,
        .dark .pricing-table td {
          border-bottom-color: rgba(76,205,196,0.1);
        }

        .pricing-table th {
          background: rgba(59,130,246,0.05);
          font-weight: 600;
          color: var(--blue-dark);
        }

        .dark .pricing-table th {
          background: rgba(76,205,196,0.08);
          color: var(--dark-text);
        }

        .pricing-table tr:last-child td {
          border-bottom: none;
        }

        .pricing-table-input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 6px;
          background: var(--white-bg);
          color: var(--blue-dark);
          outline: none;
          transition: all var(--speed) ease;
        }

        .pricing-table-input:focus {
          border-color: var(--blue);
        }

        .dark .pricing-table-input {
          background: var(--dark-card-light);
          border-color: rgba(76,205,196,0.3);
          color: var(--dark-text);
        }

        .dark .pricing-table-input:focus {
          border-color: var(--teal);
        }

        .add-row-btn {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: rgba(59,130,246,0.1);
          color: var(--blue);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all var(--speed) ease;
        }

        .add-row-btn:hover {
          background: var(--blue);
          color: white;
        }

        .dark .add-row-btn {
          background: rgba(76,205,196,0.1);
          color: var(--teal);
          border-color: rgba(76,205,196,0.2);
        }

        .dark .add-row-btn:hover {
          background: var(--teal);
          color: var(--dark-bg);
        }

        .remove-row-btn {
          background: rgba(239,68,68,0.1);
          color: #ef4444;
          border: none;
          border-radius: 4px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--speed) ease;
        }

        .remove-row-btn:hover {
          background: #ef4444;
          color: white;
        }

        /* Reservation Charges */
        .charges-grid {
          display: grid;
          gap: 1rem;
        }

        .charge-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .charge-label {
          font-weight: 500;
          color: var(--blue-dark);
          min-width: 120px;
        }

        .dark .charge-label {
          color: var(--dark-text);
        }

        .charge-input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 6px;
          background: var(--white-bg);
          color: var(--blue-dark);
          outline: none;
        }

        .charge-input:focus {
          border-color: var(--blue);
        }

        .dark .charge-input {
          background: var(--dark-card-light);
          border-color: rgba(76,205,196,0.3);
          color: var(--dark-text);
        }

        .dark .charge-input:focus {
          border-color: var(--teal);
        }

        .currency-symbol {
          color: var(--blue);
          font-weight: 600;
        }

        .dark .currency-symbol {
          color: var(--teal);
        }

        /* Image Upload Section */
        .image-upload-section {
          margin-top: 1.5rem;
        }

        .image-drop-zone {
          border: 2px dashed rgba(59,130,246,0.3);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all var(--speed) ease;
          background: rgba(59,130,246,0.02);
        }

        .image-drop-zone:hover,
        .image-drop-zone.drag-active {
          border-color: var(--blue);
          background: rgba(59,130,246,0.05);
        }

        .dark .image-drop-zone {
          border-color: rgba(76,205,196,0.3);
          background: rgba(76,205,196,0.02);
        }

        .dark .image-drop-zone:hover,
        .dark .image-drop-zone.drag-active {
          border-color: var(--teal);
          background: rgba(76,205,196,0.05);
        }

        .upload-icon {
          font-size: 3rem;
          color: var(--blue);
          margin-bottom: 1rem;
        }

        .dark .upload-icon {
          color: var(--teal);
        }

        .upload-text {
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: var(--blue-dark);
        }

        .dark .upload-text {
          color: var(--dark-text);
        }

        .upload-subtext {
          color: var(--white-text-soft);
          font-size: 0.875rem;
        }

        .dark .upload-subtext {
          color: var(--dark-text-soft);
        }

        .image-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .image-preview {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          background-size: cover;
          background-position: center;
          border: 2px solid rgba(59,130,246,0.1);
        }

        .dark .image-preview {
          border-color: rgba(76,205,196,0.1);
        }

        .image-remove {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(239,68,68,0.9);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          transition: all var(--speed) ease;
        }

        .image-remove:hover {
          background: #ef4444;
          transform: scale(1.1);
        }

        /* Submit Button */
        .submit-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(59,130,246,0.1);
        }

        .dark .submit-section {
          border-top-color: rgba(76,205,196,0.1);
        }

        .submit-btn {
          width: 100%;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, var(--blue), var(--blue-deep));
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all var(--speed) ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59,130,246,0.3);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .dark .submit-btn {
          background: linear-gradient(135deg, var(--rose), var(--teal));
        }

        .dark .submit-btn:hover:not(:disabled) {
          box-shadow: 0 8px 25px rgba(76,205,196,0.3);
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Theme Toggle */
        .theme-toggle {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 4rem;
          height: 2rem;
          background: rgba(59,130,246,0.15);
          border-radius: 1rem;
          border: 2px solid rgba(59,130,246,0.3);
          cursor: pointer;
          transition: all 0.4s ease;
          box-shadow: 0 4px 12px rgba(59,130,246,0.2);
          z-index: 50;
        }

        .theme-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59,130,246,0.3);
        }

        .dark .theme-toggle {
          background: rgba(76,205,196,0.15);
          border-color: rgba(76,205,196,0.3);
          box-shadow: 0 4px 12px rgba(76,205,196,0.2);
        }

        .dark .theme-toggle:hover {
          box-shadow: 0 6px 20px rgba(76,205,196,0.3);
        }

        .toggle-slider {
          width: 1.5rem;
          height: 1.5rem;
          background: linear-gradient(135deg, var(--blue), var(--blue-deep));
          border-radius: 50%;
          position: absolute;
          top: 0.125rem;
          left: 0.125rem;
          transition: all 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.75rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .toggle-slider-dark {
          background: linear-gradient(135deg, var(--teal), var(--rose));
          left: 2rem;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .container {
            grid-template-columns: 1fr;
            max-width: 800px;
          }
          
          .sidebar {
            order: -1;
          }
        }

        @media (max-width: 768px) {
          .create-product {
            padding: 1rem;
          }

          .two-column {
            grid-template-columns: 1fr;
          }

          .image-preview-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          }

          .pricing-table th,
          .pricing-table td {
            padding: 0.5rem;
          }

          .charge-item {
            flex-direction: column;
            align-items: stretch;
          }

          .charge-label {
            min-width: auto;
          }
        }
      `}</style>

      <div className="container">
        {/* Main Form */}
        <div className="main-form">
          <div className="header">
            <button className="back-btn" onClick={onBack}>
              <FaArrowLeft />
            </button>
            <div className="header-content">
              <h1>Create New Product</h1>
              <p>List your item for rent and start earning</p>
            </div>
          </div>

          <div className="form-container">
            <form onSubmit={handleSubmit}>
              {/* General Product Info */}
              <div className="form-section">
                <h2 className="section-title">
                  <FaFileAlt />
                  General Product Info
                </h2>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <FaTags /> Product Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g., Canon EOS 90D Camera"
                      required
                    />
                    {errors.title && <div className="form-error">{errors.title}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaFileAlt /> Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Describe your product in detail..."
                      required
                    />
                    {errors.description && <div className="form-error">{errors.description}</div>}
                  </div>

                  <div className="two-column">
                    <div className="form-group">
                      <label className="form-label">
                        <FaDollarSign /> Base Price per Day
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                      />
                      {errors.price && <div className="form-error">{errors.price}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <FaTags /> Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="electronics">Electronics</option>
                        <option value="tools">Tools</option>
                        <option value="furniture">Furniture</option>
                        <option value="audio">Audio Equipment</option>
                        <option value="events">Events</option>
                        <option value="sports">Sports</option>
                      </select>
                    </div>
                  </div>

                  <div className="two-column">
                    <div className="form-group">
                      <label className="form-label">
                        <FaCalendarAlt /> Available From
                      </label>
                      <input
                        type="date"
                        name="pickup_date"
                        value={formData.pickup_date}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                      {errors.pickup_date && <div className="form-error">{errors.pickup_date}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <FaCalendarAlt /> Available Until
                      </label>
                      <input
                        type="date"
                        name="expiration_date"
                        value={formData.expiration_date}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                      {errors.expiration_date && <div className="form-error">{errors.expiration_date}</div>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaMapMarkerAlt /> Pickup Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="123 Main Street, City, State"
                      required
                    />
                    {errors.address && <div className="form-error">{errors.address}</div>}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="submit-section">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Creating Product...
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      Create Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Rental Pricing */}
          <div className="form-section">
            <h2 className="section-title">
              <FaDollarSign />
              Rental Pricing
            </h2>
            
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Rental Period</th>
                  <th>Pricelist</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rentalPricing.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={item.period}
                        onChange={(e) => handleRentalPricingChange(index, 'period', e.target.value)}
                        className="pricing-table-input"
                        placeholder="Period"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.pricelist}
                        onChange={(e) => handleRentalPricingChange(index, 'pricelist', e.target.value)}
                        className="pricing-table-input"
                        placeholder="Pricelist"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => handleRentalPricingChange(index, 'price', e.target.value)}
                        className="pricing-table-input"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td>
                      {rentalPricing.length > 1 && (
                        <button
                          type="button"
                          className="remove-row-btn"
                          onClick={() => removeRentalPricingRow(index)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button
              type="button"
              className="add-row-btn"
              onClick={addRentalPricingRow}
            >
              <FaPlus /> Add Row
            </button>
          </div>

          {/* Rental Reservation Charges */}
          <div className="form-section">
            <h2 className="section-title">
              <FaClock />
              Rental Reservation Charges
            </h2>
            
            <div className="charges-grid">
              <div className="charge-item">
                <label className="charge-label">Extra Hour:</label>
                <span className="currency-symbol">Rs</span>
                <input
                  type="number"
                  value={reservationCharges.extraHour}
                  onChange={(e) => handleReservationChargeChange('extraHour', e.target.value)}
                  className="charge-input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="charge-item">
                <label className="charge-label">Extra Days:</label>
                <span className="currency-symbol">Rs</span>
                <input
                  type="number"
                  value={reservationCharges.extraDays}
                  onChange={(e) => handleReservationChargeChange('extraDays', e.target.value)}
                  className="charge-input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="charge-item">
                <label className="charge-label">Late Fee:</label>
                <span className="currency-symbol">Rs</span>
                <input
                  type="number"
                  value={reservationCharges.lateFee}
                  onChange={(e) => handleReservationChargeChange('lateFee', e.target.value)}
                  className="charge-input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="form-section">
            <h2 className="section-title">
              <FaImage />
              Product Images
            </h2>
            
            <div className="image-upload-section">
              <div
                className={`image-drop-zone ${dragActive ? 'drag-active' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <FaUpload className="upload-icon" />
                <div className="upload-text">
                  Drop images here or click to upload
                </div>
                <div className="upload-subtext">
                  Support: JPG, PNG, WebP (Max 5MB each)
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                style={{ display: 'none' }}
              />

              {errors.images && <div className="form-error">{errors.images}</div>}

              {images.length > 0 && (
                <div className="image-preview-grid">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="image-preview"
                      style={{ backgroundImage: `url(${image.url})` }}
                    >
                      <button
                        type="button"
                        className="image-remove"
                        onClick={() => removeImage(image.id)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Theme Toggle */}
      <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
        <div className={`toggle-slider ${isDarkMode ? 'toggle-slider-dark' : ''}`}>
          {isDarkMode ? '🌙' : '☀️'}
        </div>
      </button>
    </div>
  );
};

export default SellerCreateProduct;
