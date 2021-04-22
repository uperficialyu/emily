/**
 * @description: 外汇远期掉期交易项目路由
 * @author: 梁珊珊
 */
import React, { Component } from 'react';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { sessionGet } from 'storage';
import {
  HashRouter, Switch, Route, Redirect
} from 'react-router-dom';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import loadable from '@loadable/component';
import MainFrame from 'components/MainFrame/MainFrame';
import ToDownload from './ajax/ToDownload';

// 远期不按需加载
import ForeignExchange from 'pages/ForeignExchange/ForeignExchange';

// 随心展HeartShowExchange

moment.locale('zh-cn');
// 保证金事项管理-保证金操作日志
const OperateRecord = loadable(() => import('pages/MarginEventsManage/OperateRecord/OperateRecord'));
// 保证金事项管理-保证金事项管理
const MarginManage = loadable(() => import('pages/MarginEventsManage/MarginManage/MarginManage'));
// 保证金事项管理-保证金试算
const MarginTrial = loadable(() => import('pages/MarginEventsManage/MarginTrial/MarginTrial'));
// 保证金事项管理-授信管理
const CreditList = loadable(() => import('pages/MarginEventsManage/CreditList/CreditList'));
// 保证金事项管理-保证金事项明细
const MarginEventDetailRecord = loadable(() => import('pages/MarginEventsManage/MarginEventDetailRecord/MarginEventDetailRecord'));
// 存续期交易管理
const DurationTradeManage = loadable(() => import('pages/DurationTradeManage/DurationTradeManage'));
const SwapDurationManage = loadable(() => import('pages/SwapDurationManage/DurationTradeManage'));
const SpotDurationMananage = loadable(() => import('pages/SpotDurationMananage/DurationTradeManage'));
const GoldDurationMananage = loadable(() => import('pages/GoldDurationManage/GoldDurationManage'));
const OptionDurationMananage = loadable(() => import('pages/OptionDurationMananage/OptionDurationMananage'));

// 事件管理-审批事件
const ApproveEventManage = loadable(() => import('pages/EventsManage/ApproveEventManage'));
// 事件管理-交易事件
const TradeEventManage = loadable(() => import('pages/EventsManage/TradeEventManage'));
// 消息
const Message = loadable(() => import('pages/Message/Message'));
// 系统日志
const SystermLog = loadable(() => import('pages/Message/SystermLog/SystermLog'));
// 历史查询-即期交易查询
const SpotTradeRefer = loadable(() => import('pages/HistoryQuery/SpotTradeRefer/SpotTradeRefer'));
// 历史查询-远期交易查询
const ForwordTradeRefer = loadable(() => import('pages/HistoryQuery/ForwordTradeRefer/ForwordTradeRefer'));
// 历史查询-掉期交易查询
const SwapTradeRefer = loadable(() => import('pages/HistoryQuery/SwapTradeRefer/SwapTradeRefer'));
// 历史查询-存金盈交易查询
const GoldTradeRefer = loadable(() => import('pages/HistoryQuery/GoldTradeRefer/GoldTradeRefer'));
// 历史查询-交割查询
const DeliveryRefer = loadable(() => import('pages/HistoryQuery/DeliveryRefer/DeliveryRefer'));
// 历史查询-挂单查询
const OrderRefer = loadable(() => import('pages/HistoryQuery/OrderRefer/OrderRefer'));
// 历史查询-期权即期交易查询
const OptionExerciseRefer = loadable(() => import('pages/HistoryQuery/OptionExerciseRefer/OptionExerciseRefer'));
// 历史查询-期权费查询
const OptionFeeRefer = loadable(() => import('pages/HistoryQuery/OptionFeeRefer/OptionFeeRefer'));
// 历史查询-期权查询
const OptionTradeRefer = loadable(() => import('pages/HistoryQuery/OptionTradeRefer/OptionTradeRefer'));
// 协议
const ConsultativeManagement = loadable(() => import('pages/ConsultativeManagement/ConsultativeManagement'));
// 存金盈
const GoldProfit = loadable(() => import('pages/GoldProfit/GoldProfit'));
// 随心展
const HeartShowExchange = loadable(() => import('pages/HeartShowExchange/HeartShowExchange'));
// 外汇
// const ForeignExchange = loadable(() => import('pages/ForeignExchange/ForeignExchange'));
// 期权
const OptionExchange = loadable(() => import('pages/OptionExchange/OptionExchange'));
const CouponManage = loadable(() => import('pages/CouponManage/CouponIndex'));
function wrapperFrame(Page, AppRouterProps) {
  return class extends React.Component {
    render() {
      const { path } = this.props.match;
      const { paramAllReady, rateCodeListCanShow } = AppRouterProps;
      return (
        <MainFrame mypath={path} paramAllReady={paramAllReady} rateCodeListCanShow={rateCodeListCanShow}>
          <ErrorBoundary>
            <Page paramAllReady={paramAllReady} rateCodeListCanShow={rateCodeListCanShow} />
          </ErrorBoundary>
        </MainFrame>
      );
    }
  };
}

export default class AppRouter extends Component {
  constructor(props) {
    super(props);
  }

  /**
   *  从企银菜单进入我们避险平台的时候能不能调用下getPublicKey，判断下是不是低版本，如果是，这个时候就提示
   */
  detect() {
    const loginFlag = sessionGet('loginFlag') || 'N';
    const fromclient = sessionGet('fromclient') || '';
    const origin = {
      queryParam: {
        customerId: sessionGet('custId'),
        pageCtrl: false
      }
    };
    if (loginFlag === 'Y') {
      try {
        getPubKey(Number(fromclient));
        doFbkeyutilSign(JSON.stringify(origin), Number(fromclient));
      } catch (error) {
        if (error.message.indexOf('GetPublicKey') !== -1) {
          new ToDownload({
            title: '升级',
            message: '目前版本过低，请确认升级网上企业银行。',
            url: 'http://www.cmbchina.com/corporate/firmbank/FirmbankInfo.aspx?guid=d0917853-6256-44ea-b1e2-24b8524042db'
          });
        }
      }
    }
  }

  componentDidMount() {
    this.detect();
  }

  render() {
    const AppRouterProps = this.props;
    return (
      <LocaleProvider locale={zh_CN}>
        <HashRouter>
          <Switch>
            <Route path="/" exact component={wrapperFrame(props => <HeartShowExchange {...props} />, AppRouterProps)} />
            <Route path="/HeartShowExchange" component={wrapperFrame(props => <HeartShowExchange {...props} />, AppRouterProps)} />
            <Route path="/SpotExchange" component={wrapperFrame(props => <ForeignExchange {...props} />, AppRouterProps)} />
            <Route path="/FwdExchange" component={wrapperFrame(props => <ForeignExchange {...props} />, AppRouterProps)} />
            <Route path="/SwapExchange" component={wrapperFrame(props => <ForeignExchange {...props} />, AppRouterProps)} />
            <Route path="/SpotExchange" component={wrapperFrame(props => <ForeignExchange {...props} />, AppRouterProps)} />
            <Route path="/SpotDurationTradeManage" component={wrapperFrame(props => <SpotDurationMananage {...props} />, AppRouterProps)} />
            <Route path="/FwdDurationTradeManage" component={wrapperFrame(props => <DurationTradeManage {...props} />, AppRouterProps)} />
            <Route path="/SwapDurationTradeManage" component={wrapperFrame(props => <SwapDurationManage {...props} />, AppRouterProps)} />
            {/* <Route path="/ForeignExchange" component={wrapperFrame(props => <ForeignExchange {...props} />, AppRouterProps)} /> */}
            <Route path="/GoldProfit" component={wrapperFrame(props => <GoldProfit {...props} />, AppRouterProps)} />
            <Route path="/OptionExchange" component={wrapperFrame(props => <OptionExchange {...props} />, AppRouterProps)} />
            <Route path="/GoldDurationTradeManage" component={wrapperFrame(props => <GoldDurationMananage {...props} />, AppRouterProps)} />
            <Route path="/OptionDurationMananage" component={wrapperFrame(props => <OptionDurationMananage {...props} />, AppRouterProps)} />
            <Route path="/DurationTradeManage" component={wrapperFrame(props => <DurationTradeManage {...props} />, AppRouterProps)} />
            <Route path="/EventsManage" component={wrapperFrame(props => <EventsManage {...props} />, AppRouterProps)} />
            <Route path="/Message" component={wrapperFrame(props => <Message {...props} />, AppRouterProps)} />
            <Route path="/SystermLog" component={wrapperFrame(props => <SystermLog {...props} />, AppRouterProps)} />
            <Route path="/ConsultativeManagement" component={wrapperFrame(props => <ConsultativeManagement {...props} />, AppRouterProps)} />
            <Route path="/ForwordTradeRefer" component={wrapperFrame(props => <ForwordTradeRefer {...props} />, AppRouterProps)} />
            <Route path="/SpotTradeRefer" component={wrapperFrame(props => <SpotTradeRefer {...props} />, AppRouterProps)} />
            <Route path="/SwapTradeRefer" component={wrapperFrame(props => <SwapTradeRefer {...props} />, AppRouterProps)} />
            <Route path="/GoldTradeRefer" component={wrapperFrame(props => <GoldTradeRefer {...props} />, AppRouterProps)} />
            <Route path="/DeliveryRefer" component={wrapperFrame(props => <DeliveryRefer {...props} />, AppRouterProps)} />
            <Route path="/OrderRefer" component={wrapperFrame(props => <OrderRefer {...props} />, AppRouterProps)} />
            <Route path="/OptionExerciseRefer" component={wrapperFrame(props => <OptionExerciseRefer {...props} />, AppRouterProps)} />
            <Route path="/OptionFeeRefer" component={wrapperFrame(props => <OptionFeeRefer {...props} />, AppRouterProps)} />
            <Route path="/OperateRecord" component={wrapperFrame(props => <OperateRecord {...props} />, AppRouterProps)} />
            <Route path="/ApproveEventManage" component={wrapperFrame(props => <ApproveEventManage {...props} />, AppRouterProps)} />
            <Route path="/TradeEventManage" component={wrapperFrame(props => <TradeEventManage {...props} />, AppRouterProps)} />
            <Route path="/MarginManage" component={wrapperFrame(props => <MarginManage {...props} />, AppRouterProps)} />
            <Route path="/MarginTrial" component={wrapperFrame(props => <MarginTrial {...props} />, AppRouterProps)} />
            <Route path="/CreditList" component={wrapperFrame(props => <CreditList {...props} />, AppRouterProps)} />
            <Route path="/MarginEventDetailRecord" component={wrapperFrame(props => <MarginEventDetailRecord {...props} />, AppRouterProps)} />
            <Route path="/OptionTradeRefer" component={wrapperFrame(props => <OptionTradeRefer {...props} />, AppRouterProps)} />
            <Route path="/CouponManage" component={wrapperFrame(props => <CouponManage {...props} />, AppRouterProps)} />
            <Redirect to="/" />
          </Switch>
        </HashRouter>
      </LocaleProvider>
    );
  }
}
