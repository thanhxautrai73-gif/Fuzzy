import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { useUserStore } from '../store/useUserStore';

const NewCard = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cvv, setCvv] = useState('');
  const [expDate, setExpDate] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.remove('auth-body', 'dark');
    document.documentElement.classList.remove('auth-body', 'dark');

    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Format Card Number to have spaces: XXXX XXXX XXXX XXXX
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    const limitedVal = rawVal.substring(0, 16);
    const formatted = limitedVal.match(/.{1,4}/g)?.join(' ') || limitedVal;
    setCardNumber(formatted);
  };

  // Format Expiry Date: MM/YY
  const handleExpDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    const limitedVal = rawVal.substring(0, 4);
    let formatted = limitedVal;
    if (limitedVal.length > 2) {
      formatted = `${limitedVal.substring(0, 2)}/${limitedVal.substring(2)}`;
    }
    setExpDate(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    setCvv(rawVal.substring(0, 4));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length !== 16) {
      setErrorMsg('Số thẻ phải có đúng 16 chữ số.');
      return;
    }
    if (!cardHolderName.trim()) {
      setErrorMsg('Tên chủ thẻ không được để trống.');
      return;
    }
    if (cvv.length < 3 || cvv.length > 4) {
      setErrorMsg('Mã CVV phải có 3 hoặc 4 chữ số.');
      return;
    }
    const expRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!expRegex.test(expDate)) {
      setErrorMsg('Ngày hết hạn không hợp lệ. Vui lòng nhập định dạng MM/YY.');
      return;
    }

    setLoading(false);
    try {
      setLoading(true);
      await apiRequest('/cards', {
        method: 'POST',
        body: JSON.stringify({
          cardNumber: cleanCardNumber,
          cardHolderName: cardHolderName.toUpperCase(),
          cvv,
          expDate,
        }),
      });
      navigate('/payment');
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi thêm thẻ mới. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-start">
      <header className="section-t-space">
        <div className="custom-container">
          <div className="header-panel">
            <Link to="/payment">
              <i className="iconsax back-btn" data-icon="arrow-left"></i>
            </Link>
            <h3>Thêm Thẻ Mới</h3>
          </div>
        </div>
      </header>

      <section className="section-b-space">
        <div className="custom-container">
          {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}
          <form className="address-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Số thẻ</label>
              <div className="form-input mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter card number"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Tên chủ thẻ</label>
              <div className="form-input mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter card holder name"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                  style={{ textTransform: 'uppercase' }}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-5">
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <div className="form-input mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter cvv"
                      value={cvv}
                      onChange={handleCvvChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-7">
                <div className="form-group">
                  <label className="form-label">Ngày hết hạn (MM/YY)</label>
                  <div className="form-input mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="MM/YY"
                      value={expDate}
                      onChange={handleExpDateChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <section className="panel-space"></section>
            
            <div className="footer-modal d-flex gap-3">
              <Link to="/payment" className="btn gray-btn btn-inline mt-0 w-50">Hủy</Link>
              <button type="submit" className="theme-btn btn btn-inline mt-0 w-50" disabled={loading}>
                {loading ? 'Đang thêm...' : 'Thêm thẻ'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default NewCard;
