<!-- Date: 2016-06-29 05:26 -->

# angularJS 中如何执行 html 模版内部的 js 文件

> 在写 angularJS 项目的时候，如果我们的 tpl 中有 javascript 脚本，angularJS 出于安全考虑，会把他们全部当做文本插入到 DOM 中，但是我们的目的是想执行其中的脚本，改如何处理？

下面是我对在 angular 执行模板中脚本的案例

```html
<!DOCTYPE html>
<html lang="en" ng-app="app">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Document</title>
    </head>
    <body>
        <div ng-controller="mainCtrl">
            <div test-dire=" ng-show="></div>
        </div>
        <script src="../static/js/angular.js"></script>
        <script>
            angular
                .module('app', [])
                .controller('mainCtrl', [
                    '$scope',
                    function ($scope) {
                        console.log(1);
                    },
                ])
                .directive('testDire', [
                    function () {
                        return {
                            strict: 'EA',
                            template: 'alert(1)',
                            link: function ($scope, ele, attr) {
                                var fn = new Function(ele.text());
                                fn();
                            },
                        };
                    },
                ]);
        </script>
    </body>
</html>
```

案例可以成功运行，但是要注意一下几点：

1.  脚本文件单独写成一个自定义指令，脚本内容写在他的 template 或者 templateUrl 中，
2.  既然是脚本文件，肯定是不能显示在页面中的，不要忘记隐藏指令所在的元素
