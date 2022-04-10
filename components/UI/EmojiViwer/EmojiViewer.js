import React, { useEffect, useState } from "react";
import { getStorageUrl } from "../../../util/helper";
import style from "./EmojiViewer.module.scss";
export default function EmojiViewer({ emoji }) {
  return (
    <div className={style.emoji_viewer}>
      {emoji.map((item) => (
        <Emoji delay="6000" key={item.key} {...item}></Emoji>
      ))}
    </div>
  );
}

const Emoji = (props) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, props.delay);
  }, [props.delay]);

  return visible ? (
    <img
      className={style.emoji_item}
      src={getStorageUrl("MetaCalls-assets", props.emoji)}
      width={30}
      height={30}
      alt={props.username}
    />
  ) : null;
};
