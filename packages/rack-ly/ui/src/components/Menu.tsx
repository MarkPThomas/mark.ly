import { MenuCategory } from './MenuCategory';

export const Menu = (props) => {
  return (
    <div className="menu">
      {props.menuItems.map(menuItem => (
        <MenuCategory key={menuItem.id} title={menuItem.title} handleClick={props.onMenuClick} />
      ))}
    </div>
  );
};