<template>
  <div class="ele-body">
    <!-- 顶部卡片 -->
    <el-card shadow="never" body-style="padding: 20px;">
      <div class="ele-cell workplace-user-card">
        <div class="ele-cell-content ele-cell">
          <el-avatar :size="68" :src="$store.state.user.user.avatar"/>
          <div class="ele-cell-content" style="overflow: hidden;">
            <h4 class="ele-elip">早安，{{ $store.state.user.user.realname }}，开始您一天的工作吧！</h4>
            <div class="ele-text-secondary ele-elip" style="margin-top: 8px;">
              <i class="el-icon-heavy-rain"></i><s/><s/>今日阴转小雨，22℃ - 32℃，出门记得带伞哦。
            </div>
          </div>
        </div>
        <div class="workplace-count-group">
          <div class="workplace-count-item">
            <div class="workplace-count-header">
              <el-tag size="small" class="ele-tag-round"><i class="el-icon-menu"></i></el-tag>
              <span class="workplace-count-name">项目数</span>
            </div>
            <div class="workplace-count-num">3</div>
          </div>
          <div class="workplace-count-item">
            <div class="workplace-count-header">
              <el-tag type="warning" size="small" class="ele-tag-round"><i class="el-icon-finished"></i></el-tag>
              <span class="workplace-count-name">待办项</span>
            </div>
            <div class="workplace-count-num">6 / 24</div>
          </div>
          <div class="workplace-count-item">
            <div class="workplace-count-header">
              <el-tag type="success" size="small" class="ele-tag-round"><i class="el-icon-bell"></i></el-tag>
              <span class="workplace-count-name">消息</span>
            </div>
            <div class="workplace-count-num">1,689</div>
          </div>
        </div>
      </div>
    </el-card>
    <el-row :gutter="15">
      <el-col :md="3" :sm="6" :xs="12">
        <el-card shadow="hover" body-style="padding:0;">
          <div class="app-link-block" @click="$router.push('/system/user')">
            <i class="app-link-icon el-icon-user"></i>
            <div class="app-link-title">用户</div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="3" :sm="6" :xs="12">
        <el-card shadow="hover" body-style="padding:0;">
          <div class="app-link-block" @click="$router.push('/system/menu')">
            <i class="app-link-icon el-icon-data-line" style="color: #95de64;"></i>
            <div class="app-link-title">菜单管理</div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="3" :sm="6" :xs="12">
        <el-card shadow="hover" body-style="padding:0;">
          <div class="app-link-block" @click="$router.push('/system/operlog')">
            <i class="app-link-icon el-icon-shopping-cart-2" style="color: #ff9c6e;"></i>
            <div class="app-link-title">操作日志</div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="3" :sm="6" :xs="12">
        <el-card shadow="hover" body-style="padding:0;">
          <div class="app-link-block" @click="$router.push('/system/dictionary')">
            <i class="app-link-icon el-icon-tickets" style="color: #b37feb;"></i>
            <div class="app-link-title">字典管理</div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="3" :sm="6" :xs="12">
        <el-card shadow="hover" body-style="padding:0;">
          <div class="app-link-block" @click="$router.push('/system/config')">
            <i class="app-link-icon el-icon-bank-card" style="color: #ffd666;"></i>
            <div class="app-link-title">配置管理</div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="3" :sm="6" :xs="12">
        <el-card shadow="hover" body-style="padding:0;">
          <div class="app-link-block" @click="$router.push('/system/notice')">
            <i class="app-link-icon el-icon-message" style="color: #5cdbd3;"></i>
            <div class="app-link-title">通知公告</div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="3" :sm="6" :xs="12">
        <el-card shadow="hover" body-style="padding:0;">
          <div class="app-link-block" @click="$router.push('/member/member')">
            <i class="app-link-icon el-icon-discount" style="color: #ff85c0;"></i>
            <div class="app-link-title">会员管理</div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="3" :sm="6" :xs="12">
        <el-card shadow="hover" body-style="padding:0;">
          <div class="app-link-block" @click="$router.push('/generator/gentable')">
            <i class="app-link-icon el-icon-s-operation" style="color: #ffc069;"></i>
            <div class="app-link-title">代码生成器</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <el-col :sm="16">
        <el-card class="workplace-table-card" shadow="never" header="审批进度" body-style="padding:12px;">
          <el-table :data="projectList" height="358">
            <el-table-column type="index" width="35" min-width="35" align="right"/>
            <el-table-column label="项目名称" min-width="110">
              <template slot-scope="{row}">
                <el-link type="primary" :underline="false">{{ row.projectName }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="startDate" label="开始时间" width="95" min-width="80" align="center"/>
            <el-table-column prop="endDate" label="结束时间" width="95" min-width="80" align="center"/>
            <el-table-column label="状态" width="70" min-width="60" align="center">
              <template slot-scope="{row}">
                <span
                    :class="['ele-text-success','ele-text-danger','ele-text-warning','ele-text-info ele-text-delete'][row.state]">
                    {{ ['进行中', '已延期', '未开始', '已结束'][row.state] }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="进度" width="160" min-width="100" align="center">
              <template slot-scope="{row}">
                <el-progress :percentage="row.progress" class="ele-text-small"/>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :sm="8">
        <el-card shadow="never" header="小组成员" body-style="padding:19px 0;">
          <div v-for="(item,index) in userList" :key="index" class="ele-cell user-list-item">
            <el-avatar :size="42" :src="item.avatar"/>
            <div class="ele-cell-content">
              <div class="ele-cell-title">{{ item.name }}</div>
              <div class="ele-cell-desc">{{ item.desc }}</div>
            </div>
            <el-tag size="mini" :type="['success','danger'][item.state]">{{ ['在线', '离线'][item.state] }}</el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="8">
        <el-card shadow="never" header="最新动态" body-style="padding:0;">
          <el-scrollbar style="height:318px;" wrapStyle="overflow-x:hidden;" viewStyle="padding:20px 10px;">
            <el-timeline :reverse="false" class="ele-timeline ele-timeline-act">
              <el-timeline-item v-for="(act,index) in activities" :key="index" :timestamp="act.timestamp"
                                :type="act.primary?'primary':''">{{ act.title }}
              </el-timeline-item>
            </el-timeline>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :sm="8">
        <el-card class="workplace-table-card" shadow="never" header="我的任务" body-style="padding: 0;">
          <el-table-draggable handle=".sort-handle" :animate="300">
            <el-table :data="taskList" :height="318" class="ele-table-default-head">
              <el-table-column width="38" align="center">
                <template>
                  <i class="sort-handle el-icon-_nav ele-text-placeholder"></i>
                </template>
              </el-table-column>
              <el-table-column label="优先级" width="65">
                <template slot-scope="{row}">
                  <el-tag :type="['danger','warning','primary'][row.priority-1]"
                          size="mini" class="ele-tag-round">{{ row.priority }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="任务名称">
                <template slot-scope="{row}">
                  <el-link type="primary" :underline="false">{{ row.taskName }}</el-link>
                </template>
              </el-table-column>
              <el-table-column label="状态" width="70" align="center">
                <template slot-scope="{row}">
                  <span :class="['ele-text-warning','ele-text-success','ele-text-info ele-text-delete'][row.state]">
                      {{ ['未开始', '进行中', '已完成'][row.state] }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-table-draggable>
        </el-card>
      </el-col>
      <el-col :sm="8">
        <el-card shadow="never" header="本月目标">
          <div class="workplace-goal-group">
            <el-progress type="dashboard" :percentage="80" :width="170" :format="()=>{return ''}"/>
            <div class="workplace-goal-content">
              <el-tag size="large" class="ele-tag-round"><i class="el-icon-s-data"></i></el-tag>
              <div class="workplace-goal-num">285</div>
            </div>
            <div class="workplace-goal-text">恭喜，本月目标已达标！</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ElTableDraggable from '@/components/Sortable/ElTableDraggable'

export default {
  name: "Workplace",
  components: {ElTableDraggable},
  data() {
    return {
      activities: [
        {title: 'SunSmile 解决了bug 登录提示操作失败', timestamp: '20:30', primary: false},
        {title: 'Jasmine 解决了bug 按钮颜色与设计不符', timestamp: '19:30', primary: false},
        {title: '项目经理 指派了任务 解决项目一的bug', timestamp: '18:30', primary: true},
        {title: '项目经理 指派了任务 解决项目二的bug', timestamp: '17:30', primary: true},
        {title: '项目经理 指派了任务 解决项目三的bug', timestamp: '16:30', primary: true},
        {title: '项目经理 指派了任务 解决项目四的bug', timestamp: '15:30', primary: false},
        {title: '项目经理 指派了任务 解决项目五的bug', timestamp: '14:30', primary: false},
        {title: '项目经理 指派了任务 解决项目六的bug', timestamp: '12:30', primary: false},
        {title: '项目经理 指派了任务 解决项目七的bug', timestamp: '11:30', primary: true},
        {title: '项目经理 指派了任务 解决项目八的bug', timestamp: '10:30', primary: false},
        {title: '项目经理 指派了任务 解决项目九的bug', timestamp: '09:30', primary: false},
        {title: '项目经理 指派了任务 解决项目十的bug', timestamp: '08:30', primary: false}
      ],
      taskList: [
        {id: 1, priority: 1, taskName: '解决项目一的bug', state: 0},
        {id: 2, priority: 2, taskName: '解决项目二的bug', state: 0},
        {id: 3, priority: 2, taskName: '解决项目三的bug', state: 1},
        {id: 4, priority: 3, taskName: '解决项目四的bug', state: 1},
        {id: 5, priority: 3, taskName: '解决项目五的bug', state: 2},
        {id: 6, priority: 3, taskName: '解决项目六的bug', state: 2}
      ],
      projectList: [
        {projectName: '人工智能项目立项申请', state: 0, startDate: '2021-03-15', endDate: '2021-04-15', progress: 30},
        {projectName: 'AI智能芯片设计展', state: 0, startDate: '2021-03-01', endDate: '2021-03-05', progress: 10},
        {projectName: '智慧医疗推进会', state: 1, startDate: '2021-02-15', endDate: '2021-02-20', progress: 60},
        {projectName: '大数据智能分析平台建设', state: 1, startDate: '2021-02-10', endDate: '2021-02-22', progress: 0},
        {projectName: '云计算大数据分析', state: 2, startDate: '2021-02-05', endDate: '2021-02-25', progress: 100},
        {projectName: 'SpaceX火箭发射计划', state: 3, startDate: '2021-01-20', endDate: '2021-01-25', progress: 100},
        {projectName: '新能源汽车设计大赛', state: 3, startDate: '2021-01-01', endDate: '2021-01-08', progress: 100}
      ],
      userList: [
        {
          name: '詹姆斯·高斯林', desc: 'UI设计师、交互专家', state: 0,
          avatar: require('@/assets/logo.png')
        },
        {
          name: '詹姆斯·高斯林', desc: '前端工程师', state: 0,
          avatar: require('@/assets/logo.png')
        },
        {
          name: '詹姆斯·高斯林', desc: '前端工程师', state: 0,
          avatar: require('@/assets/logo.png')
        },
        {
          name: '詹姆斯·高斯林', desc: '产品经理、项目经理', state: 1,
          avatar: require('@/assets/logo.png')
        },
        {
          name: '詹姆斯·高斯林', desc: '组长、后端工程师', state: 1,
          avatar: require('@/assets/logo.png')
        }
      ]
    }
  },
  mounted() {

  }
}
</script>

<style scoped>
.ele-body {
  padding-bottom: 0;
}

.el-card {
  margin-bottom: 15px;
}

/** 顶部统计 */
.workplace-count-group {
  white-space: nowrap;
}

.workplace-count-item {
  padding: 0 5px 0 25px;
  box-sizing: border-box;
  display: inline-block;
  text-align: right;
}

.workplace-count-name {
  padding-left: 5px;
}

.workplace-count-num {
  font-size: 23px;
  margin-top: 6px;
}

@media screen and (max-width: 992px) {
  .workplace-count-item {
    padding: 0 5px 0 10px;
  }
}

@media screen and (max-width: 768px) {
  .workplace-user-card, .workplace-count-group {
    display: block;
  }

  .workplace-count-group {
    margin-top: 15px;
    text-align: right;
  }
}

/** 快捷方式 */
.app-link-block {
  cursor: pointer;
  text-align: center;
  padding: 15px 0;
}

.app-link-block .app-link-icon {
  color: #69c0ff;
  font-size: 30px;
  margin-top: 5px;
}

.app-link-block .app-link-title {
  margin-top: 8px;
}

/** 最新动态时间轴 */
.ele-timeline-act {
  padding-left: 50px;
}

.ele-timeline-act >>> .el-timeline-item__timestamp {
  margin: 0;
  position: absolute;
  top: 3px;
  left: -45px;
}

.ele-timeline-act >>> .el-timeline-item {
  padding-bottom: 19px;
}

.ele-timeline-act >>> .el-timeline-item:last-child {
  padding-bottom: 0;
}

/** 表格 */
.workplace-table-card >>> .el-table tbody > .el-table__row:last-child td {
  border-bottom: none;
}

.workplace-table-card >>> .el-table:before {
  display: none;
}

.sort-handle {
  cursor: move;
  font-size: 18px;
  vertical-align: middle;
}

.ele-body >>> .el-table__row.sortable-chosen {
  background-color: hsla(0, 0%, 60%, .1);
}

.ele-body >>> .el-table__row.sortable-chosen td {
  background-color: transparent;
}

/** 本月目标 */
.workplace-goal-group {
  text-align: center;
  position: relative;
  padding: 48px 0;
}

.workplace-goal-group .workplace-goal-content {
  position: absolute;
  top: 90px;
  left: 0;
  width: 100%;
}

.workplace-goal-group .workplace-goal-num {
  font-size: 40px;
  margin-top: 15px;
}

/** 小组成员 */
.user-list-item {
  padding: 13px 18px;
}

.user-list-item + .user-list-item {
  border-top: 1px solid hsla(0, 0%, 60%, .15);
}

.user-list-item .ele-cell-desc {
  margin-top: 5px;
}
</style>