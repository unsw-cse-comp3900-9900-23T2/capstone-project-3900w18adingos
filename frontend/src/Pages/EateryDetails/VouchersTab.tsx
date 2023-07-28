import { useNavigate } from "react-router-dom";
import { TabProps, UserRole } from "../../interface";
import { useEateryContext } from "../../hooks/useEateryContext";

import { useVoucher } from "../../hooks/useVoucher";
import { useEffect } from "react";

const VouchersTab: React.FC<TabProps> = ({ eatery, user }) => {
  const navigate = useNavigate();
  const { deleteVoucher, claimVoucher, fetchVouchers, fetchVouchersForEatery,eateryVouchers, customerVouchers } = useVoucher();
  const { fetchEatery } = useEateryContext();

  useEffect(() => { 
    fetchVouchersForEatery(eatery.id)
    fetchVouchers(user.id)
  }, [fetchVouchersForEatery, fetchVouchers])

  const handleDeleteVoucher = async (voucherId: string) => {
    await deleteVoucher(voucherId);
    if (eatery.id) {
      fetchEatery(eatery.id);
    }
  };

  const voucherClaim = async (voucherId: string) => {
    let result = "failed";
    if (user) {
      result = await claimVoucher(voucherId, user.id);
      if (result) {
        await fetchVouchers(user.id);
        alert("Claim successful!");
        return;
      }
    }
  };

  return (
    <div>
      {user.role === UserRole.EATERY && (<button
        className="add-review"
        onClick={() => navigate(`/restaurant/${eatery.id}/voucher/add`)}
      >
        Add New Voucher
      </button>)}

      <div className="display-reviews">
        {eateryVouchers && eateryVouchers.map((voucher, index) => {
            const startDate = new Date(voucher.start);
            const expiryDate = new Date(voucher.expiry);
            const isVoucherClaimed = customerVouchers.some(
              (customerVoucher) => customerVoucher.id === voucher.id
            );

            return (
              <div key={index} className="list-item">
                <p>Description: {voucher.description}</p>
                <p>Quantity: {voucher.quantity}</p>
                <p>Start: {startDate.toLocaleDateString()}</p>
                <p>Expires: {expiryDate.toLocaleDateString()}</p>

                {user.role == UserRole.CUSTOMER && (<button
                  className="claim-voucher"
                  onClick={() => voucherClaim(voucher.id)}
                  disabled={isVoucherClaimed}
                >
                  Claim Voucher
                </button>)}

                {user.role === UserRole.EATERY && (
                  <button onClick={() => handleDeleteVoucher(voucher.id)}>
                    <i className="bi bi-trash gl" style={{ padding: "10px" }}></i>
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default VouchersTab;
