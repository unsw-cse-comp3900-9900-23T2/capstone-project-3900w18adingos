import {EateryProfileProps } from "../../../interface";

export const EateryInfo: React.FC<EateryProfileProps> = ({ eatery }) => (
  <>
    <h4><strong>Address</strong></h4>
    <p>{eatery.location}</p>

    <hr />

    <h4><strong>Opening Hours</strong></h4>
    <div className="opening-hours">
      {Object.entries(JSON.parse(eatery.opening_hours)).map(([key, value], index) => ( 
        <p key={index}> <strong>{key}:</strong> {value as string}</p>
      ))}
    </div>
  </>
);