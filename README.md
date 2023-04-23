[![NPM version](https://img.shields.io/npm/v/ewchart.svg)](https://www.npmjs.com/package/ewchart)
[![NPM package](https://img.shields.io/npm/dy/ewchart.svg)](https://www.npmjs.com/package/ewchart)

> ewchart是专门将数据绘制成二维图形
1. 开发ewchart的目的：我在开发业务需求过程中会经常遇到各种定制化的需求，然而现在的开源绘图工具大多写的太死，ewchart中只包含必要的绘图元素，诸如tooltip，foottab这类完全由用户自定义实现
2. 支持的图形类别：折线图、面积图、饼图、直方图、散点图、树形图
3. 支持的渲染模式：svg、canvas、canvas+svg。
  + svg不适合path元素d属性超长的渲染场景，产生这种情况的一般都是曲线中包含大量的点，比如一条曲线由上万条数据生成，在用户侧可以在不影响曲线展示的情况下，将曲线中的部分点丢弃，在ewchart框架侧可以选择canvas渲染。饼图，柱状图，散点图目前只支持svg方式渲染，使用svg渲染的性能已经足够好了
  + canvas适合渲染大量的数据，可以使绘制更加细腻，但是当渲染的图形变更时需要重新计算，在这方面svg更胜一筹，svg不需要重新计算整个渲染场景，只需要修改对应需要变更的dom元素即可。当遇到图表渲染大量数据时，用户交互只改变图的部分区域，这种情况选择canvas+svg渲染，canvas负责渲染基础图形，svg负责渲染变动的区域。目前canvas渲染用来支持折线图的渲染，canvas+svg渲染用来支持折线图+brush画刷的渲染
4. 未来的计划：持续提供更多的绘图功能

## 使用方式

+ 参考[ewchart-base-template](https://www.npmjs.com/package/ewchart-base-template)

## demo图
<img width="1200" src="http://qzruncode.github.io/image/line.jpg" alt="line" >
<img width="1200" src="http://qzruncode.github.io/image/arealine.jpg" alt="arealine" >
<img width="1200" src="http://qzruncode.github.io/image/coor.jpg" alt="coor" >
<img width="1200" src="http://qzruncode.github.io/image/bar.jpg" alt="bar" >
<img width="1200" src="http://qzruncode.github.io/image/pie.jpg" alt="pie" >
<img width="1200" src="http://qzruncode.github.io/image/tree.jpg" alt="tree" >
<img width="1200" src="http://qzruncode.github.io/image/point.jpg" alt="point" >