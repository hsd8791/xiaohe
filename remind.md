###不可配置项
  新用户审核流程提醒
  注册页面(暂时不需要了...)
  联系方式等文案

###静态文件
  定制样式（定制scss 文件，批量sass 后静态上传）  
  定制icon（动态引入）



  if(this.loanInfo){
    this.loanInfo.canReborrow=this.loanInfo.repaymentTime+604800000>(new Date()).getTime()
  }

#提交申请
#等待申请
#申请成功
#客服联系放款，客服选择放款平台
#已放款，等待还款。提醒还款时间，不显示逾期费用 同时显示三种，续期（重借），逾期，还款的操作方式