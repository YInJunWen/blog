import Mock from 'better-mock';

function randomData(list) {
    return list.slice(Math.floor(Math.random() * 10 * 0.7), list.length - 1);
}
const list = [
    {
        id: 1,
        time: '2020-11-04 15:16',
        user: '张三',
        msg: 'Compressing objects: 100% (6/6), done.',
    },
    {
        id: 2,
        time: '2020-11-04 15:16',
        user: '李四，王五',
        msg: ' c0d2c81a.',
    },
    {
        id: 3,
        time: '2020-11-04 15:16',
        user: '元鹏，东凯，少鹏',
        msg: 'To http://10.10.20.6/mgd/smurfs_web.git',
    },
    {
        id: 4,
        time: '2020-11-04 15:16',
        user: '元鹏',
        msg: 'Total 7 (delta 4), reused 0 (delta 0), pack-reused 0',
    },
    {
        id: 5,
        time: '2020-11-04 15:16',
        user: '东东',
        msg: 'Writing objects: 100% (7/7), 761 bytes | 761.00 KiB/s, done.',
    },
    {
        id: 6,
        time: '2020-11-04 15:16',
        user: '王恒，元鹏',
        msg: 'Delta compression using up to 4 threads',
    },
    {
        id: 7,
        time: '2020-11-04 15:16',
        user: '伟龙',
        msg: 'Counting objects: 100% (13/13), done.',
    },
    {
        id: 8,
        time: '2020-11-04 15:16',
        user: '伟龙',
        msg: 'Counting objects: 100% (13/13), done.',
    },
    {
        id: 9,
        time: '2020-11-04 15:16',
        user: '伟龙',
        msg: 'Counting objects: 100% (13/13), done.',
    },
    {
        id: 10,
        time: '2020-11-04 15:16',
        user: '伟龙',
        msg: 'Counting objects: 100% (13/13), done.',
    },
];
Mock.mock('/getAllList', {
    list: function() {
        return randomData(list);
    },
});
