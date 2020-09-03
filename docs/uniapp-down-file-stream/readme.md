<!-- Date: 2020-08-18 13:38 -->

# uniapp 中前端处理接口中的文件流实现当前页面下载文件

```js
fetchData() // 获取后端数据
    .then((res) => {
        console.log('fetData res:', res);
        var blob = new Blob([res]); //  根据返回内容生成一个blob对象
        var elink = document.createElement('a'); // 创建一个超链接元素
        elink.download = '1.xls'; // 设置文件下载名称
        elink.style.display = 'none'; // 不在页面中显示这个超链接
        elink.href = URL.createObjectURL(blob); // 为blob对象创建一个临时的访问路径
        document.body.appendChild(elink); // 只有把超链接插入到页面中，才能
        elink.click(); // 模拟点击超链接元素
        document.body.removeChild(elink); // 触发下载弹窗后，记得移除超链接元素
    })
    .catch((err) => {
        console.log('fetData err:', err);
    });
```

下面的 Java 同学的代码，我只能看懂大致意思。

```java
public void queryAssetExportXls(Map<String, Object> paramMap, HttpServletResponse response) throws Exception {
        //在内存中创建一个Excel文件（工作簿）
        HSSFWorkbook excel = new HSSFWorkbook();
        //创建一个工作表对象
        Sheet sheet = excel.createSheet("Sheet1");
        String codeType = (String) paramMap.get("codeType");
        List<SmpMode> list = smpModeService.queryTbleModeByCodeType(codeType);
        List<String> nameGbList = list.stream().filter(sm -> !"id".equals(sm.getNameGb())).map(smpMode -> smpMode.getNameGb()).collect(Collectors.toList());
        List<String> nameCnList = list.stream().filter(sm -> !"唯一标识".equals(sm.getNameCn())).map(smpMode -> smpMode.getNameCn()).collect(Collectors.toList());
        //查询字典值
        List<SmpMode> smpModeList = list.stream().filter(smp -> smp.getEnumCodeType() != null).collect(Collectors.toList());
//        List<String> stringList = smpModeList.stream().map(smpMode -> smpMode.getNameCn()).collect(Collectors.toList());
        //存储字点值
        Map<String, List<Map>> map1 = new HashMap<>();
        Map<String, List<SysDictItem>> map2 = new HashMap<>();
        for (SmpMode smpMode : smpModeList) {
            if (smpMode.getEnumCodeType().contains("sys_") || smpMode.getEnumCodeType().contains("asset_m_")) {
                List<Map> mapList = smpAssetsServingMapper.getTableData(smpMode.getEnumCodeType());
                map1.put(smpMode.getEnumCodeType(), mapList);
            } else {
                List<SysDictItem> sysDictItems = sysDictItemService.selectByDictCode(smpMode.getEnumCodeType());
                map2.put(smpMode.getEnumCodeType(), sysDictItems);
            }
        }
        //查询codeType 表内数据
        List<Map> maps = smpAssetsServingMapper.queryAssetExportXls(codeType, nameGbList);
        List<Map> mapList = new ArrayList<>();
        for (Map map : maps) {
            for (Object key : map.keySet()) {
                for (SmpMode smpMode : smpModeList) {
                    if (smpMode.getNameGb().equals(key)) {
                        if (smpMode.getEnumCodeType().contains("asset_m_")) {
                            List<Map> mapList1 = map1.get(smpMode.getEnumCodeType());
                            for (Map map3 : mapList1) {
                                for (Object key1 : map3.keySet()) {
                                    if (map.get(key) != null && map.get(key).equals(String.valueOf((Long) map3.get("id")))) {
                                        map.put(key, (String) map3.get("z_ciname"));
                                    }
                                }
                            }
                        } else if (smpMode.getEnumCodeType().contains("sys_role")) {
                            List<Map> mapList1 = map1.get(smpMode.getEnumCodeType());
                            for (Map map3 : mapList1) {
                                for (Object key1 : map3.keySet()) {
                                    if (map.get(key) != null && map.get(key).equals(String.valueOf((Long) map3.get("id")))) {
                                        map.put(key, (String) map3.get("role_name"));
                                    }
                                }
                            }
                        } else if (smpMode.getEnumCodeType().contains("sys_depart")) {
                            List<Map> mapList1 = map1.get(smpMode.getEnumCodeType());
                            for (Map map3 : mapList1) {
                                for (Object key1 : map3.keySet()) {
                                    if (map.get(key) != null && map.get(key).equals(String.valueOf((Long) map3.get("id")))) {
                                        map.put(key, (String) map3.get("depart_name"));
                                    }
                                }
                            }
                        } else if (smpMode.getEnumCodeType().contains("sys_user")) {
                            List<Map> mapList1 = map1.get(smpMode.getEnumCodeType());
                            for (Map map3 : mapList1) {
                                for (Object key1 : map3.keySet()) {
                                    if (map.get(key) != null && map.get(key).equals(String.valueOf((Long) map3.get("id")))) {
                                        map.put(key, (String) map3.get("username"));
                                    }
                                }
                            }
                        } else {
                            List<SysDictItem> sysDictItems = map2.get(smpMode.getEnumCodeType());
                            for (SysDictItem sysDictItem : sysDictItems) {
                                if (map.get(key) != null && map.get(key).equals(String.valueOf(sysDictItem.getItemValue()))) {
                                    map.put(key, (String) sysDictItem.getItemText());
                                }
                            }
                        }
                    }
                }
            }
            mapList.add(map);
        }

        //在工作表中创建行对象
        Row title = sheet.createRow(0);
        //在行中创建单元格对象
        for (int i = 0; i < nameCnList.size(); i++) {
            title.createCell(i).setCellValue(nameCnList.get(i));
        }
        for (int i = 0; i < mapList.size(); i++) {
            Row dataRow = sheet.createRow(i + 1);
            Map map = maps.get(i);
            for (int j = 0; j < nameGbList.size(); j++) {
                dataRow.createCell(j).setCellValue((String) map.get(nameGbList.get(j)));
            }
        }
        //输出Excel文件
        OutputStream output = response.getOutputStream();
        long filename = System.currentTimeMillis();
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");//设置日期格式
        String fileName = df.format(new Date());// new Date()为获取当前系统时间
        response.setContentType("application/force-download");// 设置强制下载不打开        
        response.addHeader("Content-Disposition", "attachment;fileName=" + new String((fileName + ".xls").getBytes("UTF-8"), "iso-8859-1"));
        output.write(excel.getBytes());
        response.flushBuffer();

    }

```
