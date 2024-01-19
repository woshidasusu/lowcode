<template>
  <div class="layout-container">
    <div class="title">页面配置化平台</div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="项目里配置化的页面列表" name="project">
        <div style="display: flex">
          <div>
            <el-input
              v-model="searchParams.codeName"
              label="name"
              value="id"
              placeholder="code/name/模块"
              size="medium"
            />
          </div>
          <div style="margin-left: auto; align-self: center">
            <el-button v-if="activeTab === 'customer'" type="primary" @click="goEdit(null, 'formPage')">
              新增表单页
            </el-button>
            <el-button v-if="activeTab === 'customer'" type="primary" @click="goEdit(null, 'listPage')">
              新增列表页
            </el-button>
          </div>
        </div>
        <el-table v-loading="loading" :data="tableData" :page-size="99999" :default-columns="['index']">
          <el-table-column label="detail_id" width="320px">
            <template slot-scope="scope">
              <div v-if="scope.row.detail_id">{{ scope.row.detail_id }}</div>
            </template>
          </el-table-column>
          <el-table-column label="code" prop="code"></el-table-column>
          <el-table-column label="模块" prop="module"></el-table-column>
          <el-table-column label="name" prop="name"></el-table-column>
          <el-table-column label="个性化租户" prop="o"></el-table-column>
          <el-table-column label="启用状态">
            <template slot-scope="scope">
              <span v-if="!!+scope.row.is_deleted" style="color: #999999">未启用</span>
              <span v-else style="color: green">
                已启用
                <el-tooltip v-if="!scope.row.code">
                  <div slot="content">
                    <p>该元数据只存在本地代码中，未存储在远端数据库里</p>
                    <p>{{ scope.row.metadataPath }}</p>
                  </div>
                  <i style="font-size: 16px; margin-left: 2px" class="el-icon-warning-outline"></i>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column width="220px" label="操作">
            <template slot-scope="scope">
              <div :size="[8, 4]" wrap>
                <a @click="goDetail(scope.row, 'local')">查看本地元数据</a>
                <a @click="goPreview(scope.row, 'local')">预览</a>
                <a @click="goEdit(scope.row, scope.row.type)">编辑</a>
                <template v-if="scope.row.code">
                  <a v-if="scope.row.standard" @click="goCompare(scope.row)">
                    比对本地和服务器的元数据
                    <el-tooltip v-if="scope.row.hasUpdate">
                      <div slot="content">
                        <p>本地和服务器的元数据有差异，请及时更新</p>
                      </div>
                      <i style="font-size: 16px; color: red" class="el-icon-warning"></i>
                    </el-tooltip>
                  </a>
                  <a v-if="!!+scope.row.is_deleted" @click="enableTemplate(scope.row)">启用</a>
                  <a @click="syncDataSource(scope.row)">同步本地元数据到服务器</a>
                </template>
                <!-- <a v-if="scope.row.detail_id" @click="getUpdateSql(scope.row)">生成更新SQL</a> -->
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="本地暂存的配置化列表" name="customer">
        <div style="display: flex; margin-bottom: 24px">
          <div style="margin-left: auto; align-self: center">
            <el-button type="primary" @click="goEdit(null, 'formPage')">新增表单页</el-button>
            <el-button type="primary" @click="goEdit(null, 'listPage')">新增列表页</el-button>
            <el-button type="primary" @click="removeLocal()">清空本地缓存</el-button>
          </div>
        </div>
        <el-table :data="tableData2" :page-size="99999" :default-columns="['index']">
          <el-table-column width="150px" label="name" prop="name"></el-table-column>
          <el-table-column label="最近编辑时间" prop="last_modify"></el-table-column>
          <el-table-column width="300px" label="操作">
            <template slot-scope="scope">
              <div :size="[8, 4]" wrap>
                <a style="margin-right: 12px" @click="goDetail(scope.row, 'local')">查看本地元数据</a>
                <a style="margin-right: 12px" @click="goPreview(scope.row, 'local')">预览</a>
                <a style="margin-right: 12px" @click="goEdit(scope.row, scope.row.type)">编辑</a>
                <a style="margin-right: 12px" @click="removeLocal(scope.row.name)">删除</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import metadataList from "../config/metadata-list";
import { saveTemplateData, getMetadataList, enableTemplate } from "../../core/request";
import moment from "moment";
import { copyAtClipboard } from "@src/utils/tools";
import example from "./example";
export default {
  components: {},
  props: {},
  data() {
    return {
      activeTab: "customer",
      searchParams: {
        codeName: ""
      },
      loading: false,
      projectMetadataList: [],
      customerMetadataList: [],
      tableData2: []
    };
  },
  computed: {
    tableData() {
      let data = this.projectMetadataList;
      if (this.activeTab === "customer") {
        data = this.customerMetadataList;
      }
      data = data.filter(v => {
        if (this.searchParams.codeName) {
          return (
            v.code?.indexOf(this.searchParams.codeName) > -1 ||
            v.name?.indexOf(this.searchParams.codeName) > -1 ||
            v.module?.indexOf(this.searchParams.codeName) > -1
          );
        }
        return true;
      });
      return data;
    }
  },
  watch: {
    activeTab: {
      handler: function (newV) {
        if (newV === "project") {
          this.getProjectMetadataList();
        } else if (newV === "customer") {
          this.getCustomerMetadataList();
        }
      },
      immediate: true
    }
  },
  async mounted() {},
  destroyed() {},
  methods: {
    async getMetadataList() {
      let res = {};
      try {
        res = await getMetadataList();
      } catch (error) {
        console.error(error);
        res = error;
      }
      return res.data || [];
    },
    async getProjectMetadataList() {
      this.loading = true;
      const list = await this.getMetadataList();
      this.loading = false;
      const metadataInfoCache = {};
      list?.forEach(v => {
        v.standard = v.template;
        metadataInfoCache[v.template_id] = v;
        if (!+v.is_deleted) {
          metadataInfoCache[v.view_code] = v;
        }
      });
      this.projectMetadataList = metadataList.map(v => {
        let hasUpdate = false;
        let cache = metadataInfoCache[v.template_id];
        if (!cache && metadataInfoCache[v.code]) {
          cache = metadataInfoCache[v.code];
        }
        if (cache?.standard) {
          const remote = JSON.stringify(JSON.parse(cache.standard), " ", 2);
          const local = JSON.stringify(v.metadata, " ", 2);
          hasUpdate = remote !== local;
        }
        return {
          ...v,
          ...cache,
          hasUpdate
        };
      });
    },
    async getCustomerMetadataList() {
      let data = localStorage.getItem("customer_metadata_list");
      if (!data) {
        console.error(example)
        localStorage.setItem("customer_metadata_list", JSON.stringify(example));
        data = JSON.stringify(example);
      }
      if (data) {
        try {
          this.tableData2 = JSON.parse(data).sort((a, b) =>
            moment(a.last_modify).isBefore(moment(b.last_modify)) ? 1 : -1
          );
        } catch (error) {
          console.error(error);
        }
      } else {
        this.tableData2 = [];
      }
    },
    goCompare(item) {
      localStorage.setItem("__metadata", JSON.stringify(item));
      this.$router.push({ path: "compare" });
    },
    goDetail(item, type) {
      localStorage.setItem("__metadata", JSON.stringify(item));
      this.$router.push({ path: "detail", query: { type: type } });
    },
    goPreview(item, type) {
      localStorage.setItem("__metadata", JSON.stringify(item));
      this.$router.push({ path: "preview", query: { type: type } });
    },
    goEdit(item, type) {
      if (item) {
        localStorage.setItem("__metadata", JSON.stringify(item));
      } else {
        localStorage.removeItem("__metadata");
      }
      this.$router.push({ path: "edit", query: { type: type } });
    },
    removeLocal(name) {
      if (name) {
        let data = localStorage.getItem("customer_metadata_list");
        if (data) {
          data = JSON.parse(data);
        } else {
          data = [];
        }
        data = data.filter(v => v.name !== name);
        localStorage.setItem("customer_metadata_list", JSON.stringify(data));
      } else {
        localStorage.removeItem("customer_metadata_list");
      }
      this.$message.success("操作成功");
      this.getCustomerMetadataList();
    },
    async enableTemplate(data) {
      let tip = `是否启用【code=${data.code}】${data.name}的元数据`;
      const find = this.tableData.find(v => v.code === data.code && v.template_id !== data.template_id);
      if (find) {
        tip = `是否将【code=${data.code}】的元数据从【${find.o || "标准"}】切换到【${data.o || "标准"}】`;
      }
      this.$confirm(tip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = {};
          const params = {
            template_id: data.template_id
          };
          try {
            res = await enableTemplate(params);
          } catch (error) {
            res = error;
            console.error(error);
          }

          if (res.errcode === 0) {
            this.$message.success("启用成功!");
            this.getProjectMetadataList();
          } else {
            this.$message.error(res.errmsg || "启用失败");
          }
        })
        .catch(() => {});
    },
    /**
     * @function syncDataSource 同步到数据库
     */
    async syncDataSource(data) {
      const tip = `是否更新【code=${data.code}】${data.name}的元数据`;
      this.$confirm(tip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = {};
          const params = {
            template: JSON.stringify(data.metadata),
            template_id: data.template_id
          };
          try {
            res = await saveTemplateData(params);
          } catch (error) {
            res = error;
            console.error(error);
          }

          if (res.errcode === 0) {
            this.$message.success("同步成功!");
            this.getProjectMetadataList();
          } else {
            this.$message.error(res.errmsg || "同步失败");
          }
        })
        .catch(() => {});
    },
    getUpdateSql(data) {
      let sql = "-- 元数据更新：" + data.name + "\n";
      sql += "REPLACE INTO `kf_front_template_detail` ";
      sql +=
        "( `id`, `template_id`, `template`, `extra_front`, `template_field_json`, `created_by`, `created_on`, `modified_by`, `modified_on`, `is_deleted`, `update_timestamp` ) ";
      sql += "VALUES ( ";
      const created_by = moment().format("YYYY-MM-DD") + "平台自动生成SQL";
      const template = this.doTransform(data.standard);
      sql += `'${data.detail_id}', '${data.template_id}', ${template}, '', '', '${created_by}', now(), '${data.name}',  now(), 0, now() );`;
      copyAtClipboard(sql);
      this.$message.success("复制成功");
    },
    doTransform(metadata) {
      let data = JSON.stringify(JSON.stringify(JSON.parse(metadata)));
      data = `'${data.substring(1, data.length - 1)}'`;
      return data;
    }
  }
};
</script>

<style lang="scss" scoped>
.layout-container {
  background: #fff;
  min-height: 100vh;
  padding: 20px 40px;

  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
  }
}
</style>
