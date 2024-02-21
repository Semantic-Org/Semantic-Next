export default `.toc > .title {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  text-align: left;
  font-size: 14px;
  text-transform: none;
  font-weight: bold;
  transition: 0.3s color ease;
  padding: 0.5rem 0rem;
  color: #798088;
}
.toc > .title:hover {
  color: #FFFFFF;
}

.toc > .title.current {
  color: #73B9E1;
  cursor: default;
}
.toc > .title.active {
  color: #FFFFFF;
}
.toc > .title > .icon:not(.dropdown) {
  display: block;
  font-size: 18px;
  width: 1.5rem;
  flex: 0 0 auto;
  text-align: center;
  margin-right: 1rem;
}
.toc .content {
  display: none;
}
.toc .content.active {
  display: block;
}

.toc > .title + .content {
  padding: 0rem 0rem 0.5rem 2.5rem;
}
.toc > .content > .menu > .item {
  display: block;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1;
  margin: 2px 0px;
  padding: 5px 0px;
}
.toc > .content > .menu > .active.item {
  color: #73B9E1;
}
.toc > .content > .menu > .item:hover {
  color: rgba(255, 255, 255, 0.9);
}
.toc > .content .title {
  font-size: 13px;
  padding: 4px 0px;
}`;
