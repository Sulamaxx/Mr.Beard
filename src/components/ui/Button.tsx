// import React from 'react';

// type ButtonProps = {
//     label: string;
//     onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
//     variant?: string; // Optional prop
//     style?: React.CSSProperties; // Optional prop
//     className?: string; // Optional prop
//   };
  
//   function Button({ label, onClick, variant, style, className }: ButtonProps) {
//   let buttonStyle = style;

//   if (variant === "primary") {
//     buttonStyle = {
//       ...buttonStyle,
//       backgroundColor: "#FCA120",
//       color: "Yellow"
//     };
//   } else if (variant === "secondary") {
//     buttonStyle = {
//       ...buttonStyle,
//       backgroundColor: "#000",
//       color: "white"
//     };
//   }

//   return (
//     <button
//       className={className}
//       style={buttonStyle}
//       onClick={onClick}
//     >
//       {label}
//     </button>
//   );
// }

// export default Button;
