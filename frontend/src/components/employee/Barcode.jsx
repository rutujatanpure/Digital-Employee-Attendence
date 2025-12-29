const Barcode = ({ value }) => {
  return (
    <img
      src={`http://localhost:5000/uploads/barcode/${value}.png`}
      alt="barcode"
      style={{
        width: "180px",
        margin: "0 auto 10px",
        height: "50px",
      }}
    />
  );
};

export default Barcode;
