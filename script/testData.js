/**
 * Created by mocha on 2017/2/23.
 */
var testData = [{
    "name": "项目名称",
    "id": "10000",
    "type": "project",
    "typeName": "项目",
    "startTime": 1485878400000,
    "endTime": 1488211200000,
    "milepost":[
        {
            "name": "里程碑1",
            "id": "11001",
            "type": "milepost",
            "typeName": "里程碑",
            "startTime": 1488211200000,
            "endTime": 1488211200000,
            "milepost":[],
            "subItem":[]
        }
    ],
    "subItem":[
        {
            "name": "阶段一",
            "id": "11000",
            "type": "stage",
            "typeName": "阶段",
            "startTime": 1485878400000,
            "endTime": 1493481600000,
            "milepost":[
                {
                    "name": "里程碑1",
                    "id": "11021",
                    "type": "milepost",
                    "typeName": "里程碑",
                    "startTime": 1488211200000,
                    "endTime": 1488211200000,
                    "milepost":[],
                    "subItem":[]
                }
            ],
            "subItem":[
                {
                    "name": "阶段一任务1",
                    "id": "11100",
                    "type": "task",
                    "typeName": "任务",
                    "startTime": 1485878400000,
                    "endTime": 1493481600000,
                    "milepost":[],
                    "subItem":[
                        {
                            "name": "阶段一任务1z1",
                            "id": "11110",
                            "type": "task",
                            "typeName": "任务",
                            "startTime": 1485878400000,
                            "endTime": 1488211200000,
                            "milepost":[],
                            "subItem":[]
                        }
                    ]
                }
            ]
        },
        {
            "name": "阶段四",
            "id": "40000",
            "type": "stage",
            "typeName": "阶段",
            "startTime": 1485878400000,
            "endTime": 1488211200000,
            "milepost":[
                {
                    "name": "阶段四里程碑1",
                    "id": "42000",
                    "type": "milepost",
                    "typeName": "里程碑",
                    "startTime": 1485878400000,
                    "endTime": 1485878400000,
                    "milepost":[],
                    "subItem":[]
                }
            ],
            "subItem":[
                {
                    "name": "阶段四任务1",
                    "id": "41000",
                    "type": "task",
                    "typeName": "任务",
                    "startTime": 1485878400000,
                    "endTime": 1493481600000,
                    "milepost":[],
                    "subItem":[]
                }
            ]
        }
    ]
}];
