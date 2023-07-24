import { useEffect } from "react";
import { EateryProfileProps } from "../../../interface";
import { useVoucher } from "../../../hooks/useVoucher";


export const EateryVouchers: React.FC<EateryProfileProps> = ({ eatery, user }) => { 
  const {claimVoucher, fetchVouchersForEatery, eateryVouchers, fetchVouchers, cusomterVouchers} = useVoucher()

  useEffect(() => { 
      fetchVouchersForEatery(eatery.id)
      if (user) { 
        fetchVouchers(user.id)
      }
  },[fetchVouchersForEatery, fetchVouchers])

  const handleVoucherClaim = async (voucherId: string) => { 
    if (user) { 
      const success = await claimVoucher(voucherId, user.id)
      if (success) {
        await fetchVouchers(user.id)
        console.log(cusomterVouchers)
        alert("Claim successful!");
        return
      }
    }
    alert("Claim unsuccessful");
  }

  return ( 
    <div className="display-reviews">
    {eateryVouchers.map((voucher, index) => (
      <div key={index} className="list-item">
        <p>Description: {voucher.description}</p>
        <p>Quantity: {voucher.quantity}</p>
        <p>Start: {new Date(voucher.start).toLocaleDateString()}</p>
        <p>Expires: {new Date(voucher.expiry).toLocaleDateString()}</p>
        <button className="claim-voucher" 
          onClick={() => handleVoucherClaim(voucher.id)}
        >
          Claim Voucher
        </button>
      </div>
    ))}
  </div>
  )
}