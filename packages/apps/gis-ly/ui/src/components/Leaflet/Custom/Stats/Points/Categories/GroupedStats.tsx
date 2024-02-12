import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';
import styles from './GroupedStats.module.css';

export function GroupedStats(props: { children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal; }) {

  return (
    <div className={styles.group}>
      {props.children}
    </div>
  );
}