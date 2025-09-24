import React from "react";
import { menuData } from "../data/menuData";
import MenuItem from "./MenuItem";

const Menu: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {menuData.map((item, idx) => (
        <MenuItem key={idx} item={item} />
      ))}
    </div>
  );
};

export default Menu;
