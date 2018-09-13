
* 升级RN版本
* 替换为FlatList

error for es7 in release
https://github.com/facebook/react-native/issues/20882


更新为 FlatList 后 Header 闪动，可能与文档中的 extraData 有关
https://reactnative.cn/docs/flatlist/


renderItem中的组件最好是无状态组件，不要放内存state。
使用keyExtractor指定一个key，不要使用索引，尤其是存在列表的增删的情况下。
如果你不需要渲染就知道每一行的高度的话，那么getItemLauout是一个非常有用的优化方案。
使用合适的windowSize在内存和流畅性之间达到平衡。


https://github.com/facebook/react-native/issues/17555  blank when scroll fast