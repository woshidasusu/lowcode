export default [
  {
    isLocal: 1,
    name: "demo",
    last_modify: "2024-01-18 17:25",
    metadata: {
      type: "formPage",
      labelWidth: "130px",
      store: { state: {} },
      initFormMode: "",
      disableAll: "",
      dataSource: [],
      components: [
        { _id: 2, type: "title", showValue: "多列的布局容器", style: "" },
        {
          _id: 3,
          type: "container",
          name: "",
          labelWidth: "",
          width: "",
          style: "",
          components: [
            [
              {
                _id: 20,
                type: "switch",
                label: "是否显示时间组件",
                width: "",
                style: "",
                required: 0,
                hidden: 0,
                name: "a",
                disabled: 0,
                doubleConfirm: 0,
                eventListener: [
                  {
                    event: "change",
                    conditionType: "every",
                    conditions: [],
                    handles: [
                      {
                        type: "updateHidden",
                        value: 0,
                        targetFormItemId: "21",
                        valueFrom: {
                          type: "condition",
                          conditions: [
                            {
                              type: "expression",
                              expression: "!=",
                              leftDataSource: { type: "eventContext", fieldConfig: { key: "label", value: "value" } },
                              rightDataSource: { type: "constant", value: "1" }
                            }
                          ],
                          conditionType: "every"
                        }
                      }
                    ]
                  }
                ]
              },
              {
                _id: 21,
                type: "datePicker",
                label: "时间组件",
                width: "",
                style: "",
                required: 1,
                hidden: 0,
                name: "b",
                valueFormat: "",
                format: "",
                prefixIcon: ""
              }
            ],
            [
              {
                _id: 23,
                type: "radioGroup",
                label: "单选框组",
                width: "",
                style: "",
                required: 0,
                hidden: 0,
                name: "d",
                value: "",
                disabled: 0,
                isSelectFirst: 0,
                dataSource: {
                  type: "template",
                  options: [
                    { label: "1", value: "1" },
                    { label: "2", value: "2" },
                    { label: "3", value: "3" },
                    { label: "4", value: "4" }
                  ],
                  fieldConfig: { key: "label", value: "value" }
                },
                eventListener: []
              },
              {
                _id: 22,
                type: "checkboxGroup",
                label: "多选框组",
                width: "",
                style: "",
                required: 0,
                hidden: 0,
                name: "c",
                value: [],
                cancelConfirm: 0,
                tip: "",
                dataSource: {
                  type: "template",
                  options: [
                    { label: "1", value: "1" },
                    { label: "2", value: "2" },
                    { label: "3", value: "3" },
                    { label: "4", value: "4" }
                  ],
                  fieldConfig: { key: "label", value: "value" }
                },
                eventListener: [],
                disabled: 0
              }
            ]
          ]
        },
        { _id: 18, type: "title", showValue: "默认布局，不使用布局容器", style: "" },
        {
          _id: 19,
          type: "dynamicInput",
          label: "动态输入框",
          width: "",
          style: "",
          required: 0,
          hidden: 0,
          name: "e",
          addText: "",
          addTip: ""
        },
        { _id: 32, type: "inputNumber", label: "数字输入框", width: "", style: "", required: 0, hidden: 0, name: "f" },
        {
          _id: 11,
          type: "dataContainer",
          width: "",
          style: "",
          name: "group",
          value: {},
          components: [
            {
              _id: 27,
              type: "select",
              label: "下拉框",
              width: "",
              style: "",
              required: 0,
              hidden: 0,
              name: "g",
              disabled: 0,
              multiple: 0,
              clearable: 1,
              isSelectFirst: 0,
              dataSource: {
                type: "template",
                options: [
                  { label: "1", value: "1" },
                  { label: "2", value: "2" },
                  { label: "3", value: "3" }
                ],
                fieldConfig: { key: "label", value: "value" }
              }
            },
            {
              _id: 28,
              type: "textarea",
              label: "多行输入框",
              width: "",
              style: "",
              required: 0,
              hidden: 0,
              name: "h",
              rows: 2,
              showWordLimit: 0,
              placeholder: "",
              autosize: 0
            }
          ]
        },
        {
          _id: 15,
          type: "text",
          label: "注1：",
          width: "",
          style: "",
          required: 0,
          hidden: 0,
          name: "tip1",
          initRules: [
            {
              conditionType: "every",
              conditions: [],
              handles: [
                {
                  type: "model",
                  dataSource: {
                    type: "constant",
                    value: "表单的数据模型是根据组件绑定的字段值自动建模生成的，具体可在【编辑-预览】里实时查看"
                  }
                }
              ]
            }
          ]
        },
        {
          _id: 16,
          type: "text",
          label: "注2：",
          width: "",
          style: "",
          required: 0,
          hidden: 0,
          name: "tip2",
          initRules: [
            {
              conditionType: "every",
              conditions: [],
              handles: [
                {
                  type: "model",
                  dataSource: {
                    type: "constant",
                    value:
                      "该框架不仅仅支持配置组件的渲染，还支持配置组件之间的联动、交互，如：初始化行为（显隐、赋值等），事件的监听（change等事件），事件的响应行为（改显隐、文案、表单值、选项值等），数据源的取数（固定值，从接口取，从事件上下文参数取等），条件表达式（等于，大于，小于，是否为空等）"
                  }
                }
              ]
            }
          ]
        },
        {
          _id: 17,
          type: "text",
          label: "注3",
          width: "",
          style: "",
          required: 0,
          hidden: 0,
          name: "tip3",
          initRules: [
            {
              conditionType: "every",
              conditions: [],
              handles: [
                {
                  type: "model",
                  dataSource: {
                    type: "constant",
                    value:
                      "除了内置的组件和联动交互规则之外，组件也支持通过配置 slot 传入自定义组件，业务逻辑也支持通过传入“函数列表”+ 配置相对应的函数名完成自定义的业务逻辑"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    type: "formPage"
  }
];
