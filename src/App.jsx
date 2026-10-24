import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  TrendingUp, TrendingDown, Activity, DollarSign, Layers, PieChart,
  BarChart2, RefreshCw, Filter, Search, ArrowUpRight, ArrowDownRight,
  Sliders, ShieldAlert, Sparkles, Play, Pause, ChevronRight, Download,
  Eye, Grid, Table, Radio, Globe, Zap, Compass, BarChart3, AlertTriangle
} from 'lucide-react';

// --- INITIAL MOCK DATA DEFINITIONS ---

const ETF_DATA = [
  { id: '510300', name: '华泰柏瑞沪深300ETF', category: 'broad', price: 3.985, change: 1.25, volumeAmount: 85.4, subscription: 42.6, redemption: 18.2, netFlow: 24.4, unitShares: '+6.12亿份' },
  { id: '510500', name: '南方中证500ETF', category: 'broad', price: 5.620, change: 0.82, volumeAmount: 43.1, subscription: 21.0, redemption: 13.5, netFlow: 7.5, unitShares: '+1.33亿份' },
  { id: '159915', name: '易方达创业板ETF', category: 'broad', price: 2.150, change: -0.45, volumeAmount: 36.8, subscription: 14.2, redemption: 18.9, netFlow: -4.7, unitShares: '-2.18亿份' },
  { id: '588000', name: '华夏科创50ETF', category: 'broad', price: 0.982, change: 2.18, volumeAmount: 58.9, subscription: 35.4, redemption: 16.1, netFlow: 19.3, unitShares: '+19.65亿份' },
  { id: '512480', name: '国联安半导体ETF', category: 'sector', price: 0.945, change: 3.42, volumeAmount: 32.5, subscription: 26.8, redemption: 9.2, netFlow: 17.6, unitShares: '+18.62亿份' },
  { id: '512010', name: '易方达沪深300医药卫生ETF', category: 'sector', price: 0.380, change: -1.15, volumeAmount: 18.2, subscription: 8.5, redemption: 14.7, netFlow: -6.2, unitShares: '-16.31亿份' },
  { id: '159869', name: '华夏中证动漫游戏ETF', category: 'sector', price: 1.120, change: 4.88, volumeAmount: 22.1, subscription: 16.5, redemption: 6.1, netFlow: 10.4, unitShares: '+9.28亿份' },
  { id: '515030', name: '华夏中证新能源汽车ETF', category: 'sector', price: 1.430, change: -0.68, volumeAmount: 15.6, subscription: 6.2, redemption: 9.8, netFlow: -3.6, unitShares: '-2.51亿份' },
  { id: '518880', name: '华安黄金ETF', category: 'cross', price: 5.420, change: 0.35, volumeAmount: 14.8, subscription: 11.2, redemption: 4.8, netFlow: 6.4, unitShares: '+1.18亿份' },
  { id: '513100', name: '国泰纳斯达克100ETF', category: 'cross', price: 1.680, change: 0.94, volumeAmount: 26.3, subscription: 18.4, redemption: 7.1, netFlow: 11.3, unitShares: '+6.72亿份' },
  { id: '513050', name: '易方达中概互联50ETF', category: 'cross', price: 1.190, change: 1.80, volumeAmount: 29.7, subscription: 19.5, redemption: 10.1, netFlow: 9.4, unitShares: '+7.89亿份' },
  { id: '512660', name: '国泰中证军工ETF', category: 'sector', price: 0.986, change: 1.65, volumeAmount: 16.4, subscription: 12.3, redemption: 7.9, netFlow: 4.4, unitShares: '+4.46亿份' }
];

const SECTORS_DATA = [
  { id: 's1', name: '半导体芯片', change: 3.42, volumeRatio: 1.85, turnoverRate: 4.62, totalAmount: 985.4, netMoneyInflow: 48.6, leader: '中芯国际 (+4.2%)', peTtm: 48.2 },
  { id: 's2', name: '人工智能/算力', change: 4.15, volumeRatio: 2.12, turnoverRate: 5.38, totalAmount: 1142.0, netMoneyInflow: 62.4, leader: '寒武纪 (+8.5%)', peTtm: 65.4 },
  { id: 's3', name: '新能源与锂电', change: -0.85, volumeRatio: 0.78, turnoverRate: 1.95, totalAmount: 432.8, netMoneyInflow: -21.5, leader: '宁德时代 (-0.6%)', peTtm: 21.0 },
  { id: 's4', name: '生物医药', change: -1.45, volumeRatio: 0.82, turnoverRate: 1.64, totalAmount: 388.2, netMoneyInflow: -18.7, leader: '恒瑞医药 (-1.2%)', peTtm: 32.5 },
  { id: 's5', name: '消费电子/苹果链', change: 2.80, volumeRatio: 1.62, turnoverRate: 3.90, totalAmount: 645.1, netMoneyInflow: 31.8, leader: '立讯精密 (+3.8%)', peTtm: 24.8 },
  { id: 's6', name: '银行金融', change: 0.35, volumeRatio: 0.92, turnoverRate: 0.42, totalAmount: 285.6, netMoneyInflow: 8.5, leader: '工商银行 (+0.4%)', peTtm: 5.8 },
  { id: 's7', name: '国防军工', change: 1.78, volumeRatio: 1.45, turnoverRate: 2.85, totalAmount: 412.3, netMoneyInflow: 15.2, leader: '中航沈飞 (+2.6%)', peTtm: 42.1 },
  { id: 's8', name: '光伏设备/绿电', change: -1.92, volumeRatio: 0.95, turnoverRate: 2.10, totalAmount: 350.2, netMoneyInflow: -26.4, leader: '隆基绿能 (-2.3%)', peTtm: 18.4 },
  { id: 's9', name: '白酒与大消费', change: 0.62, volumeRatio: 0.88, turnoverRate: 1.15, totalAmount: 320.5, netMoneyInflow: 4.2, leader: '贵州茅台 (+0.7%)', peTtm: 26.2 },
  { id: 's10', name: '汽车整车/无人驾驶', change: 2.15, volumeRatio: 1.54, turnoverRate: 3.40, totalAmount: 512.4, netMoneyInflow: 22.8, leader: '赛力斯 (+4.5%)', peTtm: 38.6 },
  { id: 's11', name: '光模块CPO', change: 5.32, volumeRatio: 2.45, turnoverRate: 7.20, totalAmount: 890.6, netMoneyInflow: 54.2, leader: '中际旭创 (+6.2%)', peTtm: 52.3 },
  { id: 's12', name: '央企中特估/基建', change: -0.22, volumeRatio: 0.74, turnoverRate: 0.88, totalAmount: 210.8, netMoneyInflow: -5.3, leader: '中国建筑 (-0.3%)', peTtm: 4.6 }
];

export default function App() {
  // Global Market Settings
  const [colorMode, setColorMode] = useState('cn'); // 'cn': red=up, green=down; 'intl': green=up, red=down
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'etf', 'sectors', 'indicators'
  const [isSimulating, setIsSimulating] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  // Data states
  const [etfs, setEtfs] = useState(ETF_DATA);
  const [sectors, setSectors] = useState(SECTORS_DATA);
  
  // Market Health Indicators State
  const [marketTemp, setMarketTemp] = useState(68); // 0-100
  const [northboundFlow, setNorthboundFlow] = useState(58.4); // 亿元
  const [totalTurnover, setTotalTurnover] = useState(11580); // 亿元
  const [advancersCount, setAdvancersCount] = useState(3280);
  const [declinersCount, setDeclinersCount] = useState(1640);
  const [limitUpCount, setLimitUpCount] = useState(78);
  const [limitDownCount, setLimitDownCount] = useState(6);
  const [brokenLimitRate, setBrokenLimitRate] = useState(14.8); // 炸板率 %

  // Filter & Search states
  const [etfCategoryFilter, setEtfCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [etfSortKey, setEtfSortKey] = useState('netFlow');
  const [sectorSortKey, setSectorSortKey] = useState('totalAmount');
  const [selectedSector, setSelectedSector] = useState(null);

  // Real-time Simulation Engine
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      // Small simulated price & volume nudges
      setEtfs(prev => prev.map(item => {
        const delta = (Math.random() - 0.48) * 0.15;
        const netDelta = (Math.random() - 0.48) * 0.8;
        return {
          ...item,
          change: +(item.change + delta).toFixed(2),
          netFlow: +(item.netFlow + netDelta).toFixed(2),
          volumeAmount: +(item.volumeAmount + Math.abs(netDelta) * 0.4).toFixed(1)
        };
      }));

      setSectors(prev => prev.map(s => {
        const deltaChange = (Math.random() - 0.47) * 0.2;
        const deltaFlow = (Math.random() - 0.48) * 2;
        return {
          ...s,
          change: +(s.change + deltaChange).toFixed(2),
          netMoneyInflow: +(s.netMoneyInflow + deltaFlow).toFixed(1),
          totalAmount: +(s.totalAmount + Math.abs(deltaFlow) * 1.5).toFixed(1)
        };
      }));

      setNorthboundFlow(f => +(f + (Math.random() - 0.45) * 1.2).toFixed(2));
      setLastUpdated(new Date().toLocaleTimeString());
    }, 3500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Color helper functions based on Market Standard
  const getUpColorClass = () => (colorMode === 'cn' ? 'text-rose-500' : 'text-emerald-400');
  const getDownColorClass = () => (colorMode === 'cn' ? 'text-emerald-400' : 'text-rose-500');
  const getUpBgClass = () => (colorMode === 'cn' ? 'bg-rose-500/15 border-rose-500/30 text-rose-400' : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400');
  const getDownBgClass = () => (colorMode === 'cn' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/15 border-rose-500/30 text-rose-400');

  const formatDeltaClass = (val) => {
    if (val > 0) return colorMode === 'cn' ? 'text-rose-400' : 'text-emerald-400';
    if (val < 0) return colorMode === 'cn' ? 'text-emerald-400' : 'text-rose-400';
    return 'text-slate-400';
  };

  // Filtered ETF list
  const filteredEtfs = useMemo(() => {
    return etfs
      .filter(etf => etfCategoryFilter === 'all' || etf.category === etfCategoryFilter)
      .filter(etf => etf.name.toLowerCase().includes(searchQuery.toLowerCase()) || etf.id.includes(searchQuery))
      .sort((a, b) => Math.abs(b[etfSortKey]) - Math.abs(a[etfSortKey]));
  }, [etfs, etfCategoryFilter, searchQuery, etfSortKey]);

  // Filtered Sectors
  const sortedSectors = useMemo(() => {
    return [...sectors].sort((a, b) => b[sectorSortKey] - a[sectorSortKey]);
  }, [sectors, sectorSortKey]);

  // Total ETF Net flow calculation
  const totalEtfInflow = useMemo(() => {
    return etfs.reduce((acc, curr) => acc + curr.netFlow, 0).toFixed(1);
  }, [etfs]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* 1. TOP FINANCIAL TERMINAL HEADER */}
      <header className="border-b border-slate-800/80 bg-[#0b101d]/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-cyan-600 via-indigo-600 to-rose-500 p-[1.5px] shadow-lg shadow-indigo-500/20">
            <div className="h-full w-full bg-[#090d18] rounded-[7px] flex items-center justify-center">
              <Zap className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-lg tracking-wider text-slate-100">AlphaLens</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-mono tracking-tight font-semibold">
                QUANT v4.2
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline">| 智研量化高频全景监控</span>
            </div>
          </div>
        </div>

        {/* Global Key Stats Bar */}
        <div className="hidden lg:flex items-center space-x-6 text-xs font-mono bg-slate-900/80 px-4 py-1.5 rounded-lg border border-slate-800/90">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">两市总成交:</span>
            <span className="text-amber-400 font-bold">{totalTurnover} 亿元</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1 rounded">突破20日均量</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-700" />
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">北向资金(净买入):</span>
            <span className={`font-bold ${formatDeltaClass(northboundFlow)}`}>
              {northboundFlow > 0 ? `+${northboundFlow}` : northboundFlow} 亿元
            </span>
          </div>
          <div className="h-3 w-[1px] bg-slate-700" />
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">市场温度:</span>
            <span className="text-cyan-400 font-bold">{marketTemp}°C</span>
            <div className="w-12 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${marketTemp > 60 ? 'bg-rose-500' : 'bg-cyan-500'}`} 
                style={{ width: `${marketTemp}%` }}
              />
            </div>
          </div>
        </div>

        {/* Controls & Mode switches */}
        <div className="flex items-center space-x-2">
          {/* Color Mode Toggle */}
          <button
            onClick={() => setColorMode(m => (m === 'cn' ? 'intl' : 'cn'))}
            title={colorMode === 'cn' ? '当前：国内习惯 (红涨绿跌)' : '当前：国际惯例 (绿涨红跌)'}
            className="flex items-center space-x-1.5 text-xs bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 px-2.5 py-1.5 rounded-md transition"
          >
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-medium text-slate-300">
              {colorMode === 'cn' ? '🇨🇳 红涨绿跌' : '🌐 绿涨红跌'}
            </span>
          </button>

          {/* Simulation Toggle */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center space-x-1.5 text-xs px-2.5 py-1.5 rounded-md border transition ${
              isSimulating
                ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
          >
            {isSimulating ? <Play className="h-3 w-3 fill-cyan-400" /> : <Pause className="h-3 w-3" />}
            <span>{isSimulating ? '实时Tick接收' : '已暂停'}</span>
          </button>

          {/* Refresh pulse */}
          <div className="text-[11px] text-slate-500 font-mono hidden md:block">
            {lastUpdated}
          </div>
        </div>
      </header>

      {/* 2. SUB-NAVIGATION & WORKSPACE TABS */}
      <div className="border-b border-slate-800/60 bg-[#090e1a]/95 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center space-x-1.5 ${
              activeTab === 'overview'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            <span>全景量化工作台</span>
          </button>
          <button
            onClick={() => setActiveTab('etf')}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center space-x-1.5 ${
              activeTab === 'etf'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>ETF申赎净流动</span>
          </button>
          <button
            onClick={() => setActiveTab('sectors')}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center space-x-1.5 ${
              activeTab === 'sectors'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>板块量能矩阵</span>
          </button>
          <button
            onClick={() => setActiveTab('indicators')}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center space-x-1.5 ${
              activeTab === 'indicators'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            <span>分析师高频情绪库</span>
          </button>
        </div>

        {/* Global Quick Search */}
        <div className="relative w-64 max-w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索 ETF 代码、名称或板块..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-md pl-8 pr-3 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 placeholder-slate-500"
          />
        </div>
      </div>

      {/* 3. CORE CONTENT AREA */}
      <main className="flex-1 p-4 md:p-6 space-y-6 max-w-[1720px] mx-auto w-full">

        {/* --- SECTION A: ANALYST CORE SENTIMENT TILES (Always visible in Top Strip) --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Indicator 1: Advance / Decline Breadth */}
          <div className="bg-[#0e1424] border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700 transition shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>全市场涨跌比</span>
              <Compass className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className={`text-lg font-bold font-mono ${getUpColorClass()}`}>{advancersCount}</span>
              <span className="text-xs text-slate-500">/</span>
              <span className={`text-sm font-semibold font-mono ${getDownColorClass()}`}>{declinersCount}</span>
            </div>
            <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-2 flex">
              <div 
                className={`${colorMode === 'cn' ? 'bg-rose-500' : 'bg-emerald-400'}`} 
                style={{ width: `${(advancersCount / (advancersCount + declinersCount)) * 100}%` }} 
              />
              <div 
                className={`${colorMode === 'cn' ? 'bg-emerald-500' : 'bg-rose-400'}`} 
                style={{ width: `${(declinersCount / (advancersCount + declinersCount)) * 100}%` }} 
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1.5 flex justify-between">
              <span>多头占优</span>
              <span>{(advancersCount / declinersCount).toFixed(2)}:1</span>
            </div>
          </div>

          {/* Indicator 2: Limit Up/Down & Broken Limit Rate */}
          <div className="bg-[#0e1424] border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700 transition shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>涨停 / 跌停 / 炸板</span>
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className={`text-lg font-bold font-mono ${getUpColorClass()}`}>{limitUpCount}</span>
              <span className="text-xs text-slate-500">/</span>
              <span className={`text-sm font-semibold font-mono ${getDownColorClass()}`}>{limitDownCount}</span>
              <span className="text-xs text-amber-400 ml-auto font-mono">{brokenLimitRate}%</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-3 flex justify-between items-center">
              <span>短线接力热度:</span>
              <span className="text-emerald-400 font-semibold bg-emerald-950/40 px-1 rounded">极强高潮</span>
            </div>
          </div>

          {/* Indicator 3: Net ETF Inflow Today */}
          <div className="bg-[#0e1424] border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700 transition shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>重点ETF今日净申购</span>
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className={`text-lg font-bold font-mono ${formatDeltaClass(parseFloat(totalEtfInflow))}`}>
                {parseFloat(totalEtfInflow) > 0 ? `+${totalEtfInflow}` : totalEtfInflow}
              </span>
              <span className="text-xs text-slate-400">亿元</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-3 flex justify-between">
              <span>以宽基/科技为主</span>
              <span className="text-rose-400">持续扩容</span>
            </div>
          </div>

          {/* Indicator 4: Northbound Money */}
          <div className="bg-[#0e1424] border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700 transition shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>北向聪明资金</span>
              <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className={`text-lg font-bold font-mono ${formatDeltaClass(northboundFlow)}`}>
                {northboundFlow > 0 ? `+${northboundFlow}` : northboundFlow}
              </span>
              <span className="text-xs text-slate-400">亿元</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-3 flex justify-between">
              <span>沪股通 +32.1亿</span>
              <span>深股通 +26.3亿</span>
            </div>
          </div>

          {/* Indicator 5: Two-market Volume vs MA20 */}
          <div className="bg-[#0e1424] border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700 transition shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>成交放量倍率 (量比)</span>
              <BarChart3 className="h-3.5 w-3.5 text-purple-400" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-lg font-bold font-mono text-cyan-400">1.28</span>
              <span className="text-xs text-slate-500">x 5日均量</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-3 flex justify-between">
              <span>增量资金入场</span>
              <span className="text-cyan-400">放量上攻</span>
            </div>
          </div>

          {/* Indicator 6: Analyst Sentiment Rating */}
          <div className="bg-[#0e1424] border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700 transition shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>分析师量化评级</span>
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-base font-bold text-rose-400">积极做多</span>
              <span className="text-xs text-slate-400 font-mono">BETA: 1.34</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-3 flex justify-between">
              <span>防守位: 3080</span>
              <span className="text-emerald-400">风险敞口正常</span>
            </div>
          </div>
        </div>

        {/* --- CONDITIONAL VIEW 1: OVERVIEW / DASHBOARD GRID --- */}
        {(activeTab === 'overview' || activeTab === 'etf') && (
          <section className="space-y-4">
            {/* Section Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1322] p-4 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                    <span>ETF 申购与赎回流出量高频监测</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md font-normal">
                      当日一级市场净申购金额（亿元）
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    监测机构主力与被动资金动向。申购赎回折算为净资金流向与份额变动。
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-2">
                <div className="bg-slate-900 border border-slate-700/80 rounded-lg p-1 flex space-x-1 text-xs">
                  <button
                    onClick={() => setEtfCategoryFilter('all')}
                    className={`px-2.5 py-1 rounded transition ${
                      etfCategoryFilter === 'all' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    全部类别
                  </button>
                  <button
                    onClick={() => setEtfCategoryFilter('broad')}
                    className={`px-2.5 py-1 rounded transition ${
                      etfCategoryFilter === 'broad' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    宽基指数
                  </button>
                  <button
                    onClick={() => setEtfCategoryFilter('sector')}
                    className={`px-2.5 py-1 rounded transition ${
                      etfCategoryFilter === 'sector' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    行业主题
                  </button>
                  <button
                    onClick={() => setEtfCategoryFilter('cross')}
                    className={`px-2.5 py-1 rounded transition ${
                      etfCategoryFilter === 'cross' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    跨境与大宗
                  </button>
                </div>

                {/* Sort Toggle */}
                <select
                  value={etfSortKey}
                  onChange={(e) => setEtfSortKey(e.target.value)}
                  className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="netFlow">按净流入量排序</option>
                  <option value="subscription">按申购量排序</option>
                  <option value="redemption">按赎回量排序</option>
                  <option value="volumeAmount">按成交额排序</option>
                </select>
              </div>
            </div>

            {/* ETF Visual Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column: Visual Net Inflow Bar Chart (CSS-based high precision) */}
              <div className="lg:col-span-2 bg-[#0d1322] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <BarChart2 className="h-4 w-4 text-cyan-400" />
                    <span>ETF 净流入 / 流出阶梯榜 (亿元)</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center space-x-1">
                      <span className={`w-2.5 h-2.5 rounded-sm ${colorMode === 'cn' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      <span>净申购流入</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className={`w-2.5 h-2.5 rounded-sm ${colorMode === 'cn' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span>净赎回流出</span>
                    </span>
                  </div>
                </div>

                {/* Interactive Dynamic Bar Visuals */}
                <div className="space-y-2.5 my-2">
                  {filteredEtfs.slice(0, 7).map((item) => {
                    const maxVal = 26; // max scale baseline
                    const isPositive = item.netFlow >= 0;
                    const pct = Math.min(100, Math.round((Math.abs(item.netFlow) / maxVal) * 100));

                    return (
                      <div key={item.id} className="group bg-slate-900/60 hover:bg-slate-800/60 p-2 rounded-lg transition border border-transparent hover:border-slate-700/60">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-[11px] text-slate-400">{item.id}</span>
                            <span className="font-medium text-slate-200">{item.name}</span>
                            <span className="text-[10px] text-slate-500 hidden sm:inline">({item.unitShares})</span>
                          </div>
                          <div className="flex items-center space-x-3 font-mono">
                            <span className={`text-xs ${formatDeltaClass(item.change)}`}>
                              {item.change > 0 ? `+${item.change}%` : `${item.change}%`}
                            </span>
                            <span className={`font-bold text-xs ${formatDeltaClass(item.netFlow)}`}>
                              {item.netFlow > 0 ? `+${item.netFlow}` : item.netFlow} 亿
                            </span>
                          </div>
                        </div>

                        {/* Split Bar Visual */}
                        <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden flex items-center relative">
                          <div className="w-1/2 h-full flex justify-end border-r border-slate-600/40">
                            {!isPositive && (
                              <div
                                style={{ width: `${pct}%` }}
                                className={`h-full rounded-l-sm transition-all duration-500 ${
                                  colorMode === 'cn' ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                              />
                            )}
                          </div>
                          <div className="w-1/2 h-full flex justify-start">
                            {isPositive && (
                              <div
                                style={{ width: `${pct}%` }}
                                className={`h-full rounded-r-sm transition-all duration-500 ${
                                  colorMode === 'cn' ? 'bg-rose-500' : 'bg-emerald-500'
                                }`}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                  <span>数据源：交易所一级市场申赎代理清单 (PCFs) 实时测算</span>
                  <span className="text-cyan-400 cursor-pointer hover:underline">查看全市场750+只ETF明细 →</span>
                </div>
              </div>

              {/* Right Column: Inflow / Outflow Breakdown Stack */}
              <div className="bg-[#0d1322] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                      <PieChart className="h-4 w-4 text-indigo-400" />
                      <span>一级市场申赎双向剖析</span>
                    </span>
                    <span className="text-[10px] text-slate-500">单位: 亿元</span>
                  </div>

                  <div className="space-y-3">
                    {filteredEtfs.slice(0, 5).map(item => (
                      <div key={item.id} className="text-xs bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-medium text-slate-200 truncate max-w-[130px]">{item.name}</span>
                          <span className="font-mono text-slate-400 text-[11px]">成交: {item.volumeAmount}亿</span>
                        </div>
                        {/* Subscription vs Redemption stacked ratio */}
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                          <div
                            title={`申购量: ${item.subscription}亿`}
                            className="bg-cyan-500 transition-all duration-300"
                            style={{ width: `${(item.subscription / (item.subscription + item.redemption)) * 100}%` }}
                          />
                          <div
                            title={`赎回量: ${item.redemption}亿`}
                            className="bg-amber-500/80 transition-all duration-300"
                            style={{ width: `${(item.redemption / (item.subscription + item.redemption)) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono mt-1 text-slate-400">
                          <span className="text-cyan-400">申: {item.subscription}亿</span>
                          <span className="text-amber-400">赎: {item.redemption}亿</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-[11px] text-indigo-300">
                  <span className="font-semibold">💡 量化分析师解读:</span> 头部宽基ETF（如沪深300与科创50）持续呈现大额单边净申购，往往代表“国家队”平准基金或险资等长线机构在关键点位构筑资金底。
                </div>
              </div>
            </div>

            {/* ETF Data Screener Table View */}
            <div className="bg-[#0d1322] border border-slate-800/80 rounded-xl overflow-hidden">
              <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Table className="h-4 w-4 text-cyan-400" />
                  <span>ETF 申赎全量明细看板</span>
                </span>
                <span className="text-xs text-slate-500">共 {filteredEtfs.length} 个标的</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b101c] text-slate-400 border-b border-slate-800 font-mono">
                    <tr>
                      <th className="p-3">代码 / 名称</th>
                      <th className="p-3">类型</th>
                      <th className="p-3 text-right">最新价</th>
                      <th className="p-3 text-right">涨跌幅</th>
                      <th className="p-3 text-right">申购量 (亿)</th>
                      <th className="p-3 text-right">赎回量 (亿)</th>
                      <th className="p-3 text-right font-bold text-slate-200">净申购额 (亿)</th>
                      <th className="p-3 text-right">二级市场成交额</th>
                      <th className="p-3 text-center">估算份额变动</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {filteredEtfs.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-sans">
                          <div className="font-semibold text-slate-200">{item.name}</div>
                          <div className="text-[10px] text-slate-500">{item.id}</div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                            {item.category === 'broad' ? '宽基指数' : item.category === 'sector' ? '行业主题' : '跨境大宗'}
                          </span>
                        </td>
                        <td className="p-3 text-right text-slate-300">{item.price.toFixed(3)}</td>
                        <td className={`p-3 text-right font-semibold ${formatDeltaClass(item.change)}`}>
                          {item.change > 0 ? `+${item.change}%` : `${item.change}%`}
                        </td>
                        <td className="p-3 text-right text-cyan-400">{item.subscription.toFixed(1)}</td>
                        <td className="p-3 text-right text-amber-400">{item.redemption.toFixed(1)}</td>
                        <td className={`p-3 text-right font-bold text-sm ${formatDeltaClass(item.netFlow)}`}>
                          {item.netFlow > 0 ? `+${item.netFlow}` : item.netFlow}
                        </td>
                        <td className="p-3 text-right text-slate-300">{item.volumeAmount} 亿</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${
                            item.unitShares.startsWith('+') ? getUpBgClass() : getDownBgClass()
                          }`}>
                            {item.unitShares}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* --- SECTION B: SECTOR VOLUME & MOMENTUM COMPARISON MATRIX --- */}
        {(activeTab === 'overview' || activeTab === 'sectors') && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1322] p-4 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                    <span>板块量能对比与四象限动量矩阵</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md font-normal">
                      X: 成交额 | Y: 涨跌幅 | 气泡大小: 量比 (Volume Ratio)
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    分析资金集聚效应。第一象限（右上）为「量价齐升主线板块」，第四象限（右下）为「放量滞涨/出逃风险区」。
                  </p>
                </div>
              </div>

              {/* Sort Switch */}
              <div className="flex items-center space-x-2">
                <select
                  value={sectorSortKey}
                  onChange={(e) => setSectorSortKey(e.target.value)}
                  className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="totalAmount">按成交总额排序</option>
                  <option value="change">按涨跌幅排序</option>
                  <option value="volumeRatio">按量比 (爆量度) 排序</option>
                  <option value="netMoneyInflow">按主力资金净流入排序</option>
                </select>
              </div>
            </div>

            {/* 2D Interactive Scatter / Matrix View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Matrix Canvas Map */}
              <div className="lg:col-span-8 bg-[#0d1322] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between relative min-h-[440px]">
                <div className="flex justify-between items-center text-xs mb-2">
                  <div className="font-semibold text-slate-300 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>资金动量四象限散点图 (交互点击选择)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Y轴: 涨跌幅 (%) | X轴: 成交额 (亿元)
                  </div>
                </div>

                {/* Simulated Chart Plane */}
                <div className="relative w-full h-[360px] bg-slate-950/60 rounded-xl border border-slate-800/80 overflow-hidden p-4">
                  {/* Quadrant Axis Lines */}
                  <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-slate-700/60" />
                  <div className="absolute top-0 bottom-0 left-1/2 border-l border-dashed border-slate-700/60" />

                  {/* Quadrant Watermarks */}
                  <div className="absolute top-3 right-4 text-[11px] font-bold text-rose-500/20 uppercase tracking-widest pointer-events-none">
                    主线加速区 (放量大涨)
                  </div>
                  <div className="absolute top-3 left-4 text-[11px] font-bold text-cyan-500/20 uppercase tracking-widest pointer-events-none">
                    缩量蓄势区 (惜售推升)
                  </div>
                  <div className="absolute bottom-3 left-4 text-[11px] font-bold text-slate-500/20 uppercase tracking-widest pointer-events-none">
                    冷门阴跌区 (无量回落)
                  </div>
                  <div className="absolute bottom-3 right-4 text-[11px] font-bold text-emerald-500/20 uppercase tracking-widest pointer-events-none">
                    资金分歧区 (放量滞涨/出货)
                  </div>

                  {/* Bubbles Render */}
                  {sectors.map((sec) => {
                    // Coordinate Mapping:
                    // X range: 200 to 1200 -> 8% to 92%
                    // Y range: -3% to +6% -> 90% to 10%
                    const xPct = Math.max(8, Math.min(92, ((sec.totalAmount - 150) / 1050) * 100));
                    const yPct = Math.max(10, Math.min(90, 50 - (sec.change / 6) * 45));
                    const bubbleSize = Math.max(34, Math.min(68, sec.volumeRatio * 26));

                    const isSelected = selectedSector?.id === sec.id;

                    return (
                      <div
                        key={sec.id}
                        onClick={() => setSelectedSector(sec)}
                        style={{
                          left: `${xPct}%`,
                          top: `${yPct}%`,
                          width: `${bubbleSize}px`,
                          height: `${bubbleSize}px`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        className={`absolute rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-xl group ${
                          sec.change >= 0
                            ? colorMode === 'cn' ? 'bg-rose-500/25 border-rose-500/80 text-rose-300' : 'bg-emerald-500/25 border-emerald-500/80 text-emerald-300'
                            : colorMode === 'cn' ? 'bg-emerald-500/25 border-emerald-500/80 text-emerald-300' : 'bg-rose-500/25 border-rose-500/80 text-rose-300'
                        } border-2 backdrop-blur-sm hover:scale-125 hover:z-30 ${isSelected ? 'ring-4 ring-cyan-400 z-30' : ''}`}
                      >
                        <span className="text-[10px] font-bold text-center leading-none px-1 truncate w-full text-slate-100">
                          {sec.name.slice(0, 4)}
                        </span>
                        <span className="text-[9px] font-mono font-semibold">
                          {sec.change > 0 ? `+${sec.change}%` : `${sec.change}%`}
                        </span>

                        {/* Hover Quick Card */}
                        <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-44 bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-2xl z-40 text-left pointer-events-none">
                          <div className="font-bold text-slate-200 text-xs">{sec.name}</div>
                          <div className="text-[11px] text-slate-400 mt-1 space-y-0.5 font-mono">
                            <div>成交额: <span className="text-slate-200">{sec.totalAmount} 亿</span></div>
                            <div>量比: <span className="text-cyan-400">{sec.volumeRatio}x</span></div>
                            <div>换手率: <span className="text-amber-400">{sec.turnoverRate}%</span></div>
                            <div>净流入: <span className={formatDeltaClass(sec.netMoneyInflow)}>{sec.netMoneyInflow} 亿</span></div>
                            <div>领头龙头: <span className="text-slate-300">{sec.leader}</span></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2">
                  <span>💡 提示：点击任意板块气泡，右侧将切换其专属深度量能诊断</span>
                  <span>气泡直径与日内「量比」呈正比</span>
                </div>
              </div>

              {/* Right Column: Selected Sector Quant Deep-dive */}
              <div className="lg:col-span-4 bg-[#0d1322] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                      <Zap className="h-4 w-4 text-cyan-400" />
                      <span>板块深度量化画像</span>
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {selectedSector ? '已选定' : '默认领涨板块'}
                    </span>
                  </div>

                  {(() => {
                    const current = selectedSector || sectors[0];
                    return (
                      <div className="space-y-4">
                        <div>
                          <div className="text-lg font-black text-slate-100 flex items-center justify-between">
                            <span>{current.name}</span>
                            <span className={`text-base font-mono ${formatDeltaClass(current.change)}`}>
                              {current.change > 0 ? `+${current.change}%` : `${current.change}%`}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            龙头代表股: <span className="text-cyan-400 font-medium">{current.leader}</span>
                          </div>
                        </div>

                        {/* Metric Cards Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-400">板块成交总额</div>
                            <div className="text-sm font-bold text-slate-200 mt-0.5">{current.totalAmount} 亿元</div>
                            <div className="text-[10px] text-cyan-400 mt-1">占两市 {(current.totalAmount / totalTurnover * 100).toFixed(1)}%</div>
                          </div>
                          <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-400">当日量比 (Volume Ratio)</div>
                            <div className="text-sm font-bold text-amber-400 mt-0.5">{current.volumeRatio} 倍</div>
                            <div className="text-[10px] text-slate-400 mt-1">{current.volumeRatio > 1.5 ? '严重放量' : '量能平稳'}</div>
                          </div>
                          <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-400">主力资金净主动买</div>
                            <div className={`text-sm font-bold mt-0.5 ${formatDeltaClass(current.netMoneyInflow)}`}>
                              {current.netMoneyInflow > 0 ? `+${current.netMoneyInflow}` : current.netMoneyInflow} 亿元
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">超大单占比 62%</div>
                          </div>
                          <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-400">板块动态估值 (PE-TTM)</div>
                            <div className="text-sm font-bold text-purple-400 mt-0.5">{current.peTtm} 倍</div>
                            <div className="text-[10px] text-slate-400 mt-1">历史分位 58%</div>
                          </div>
                        </div>

                        {/* Quant Diagnosis Tag */}
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                          <div className="font-semibold text-slate-200 flex items-center space-x-1.5">
                            <ShieldAlert className="h-3.5 w-3.5 text-cyan-400" />
                            <span>量化研判系统评估:</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            {current.change > 2 && current.volumeRatio > 1.5
                              ? '【多头高潮爆发】该板块受增量机构资金强力扫盘，量比显著大于1.5，短线动量处于极高区间，适合顺势持有，防范次日冲高冲浪分歧。'
                              : current.change < -1 && current.volumeRatio > 1.2
                              ? '【空头放量杀跌】抛压集中释放，且未见大额护盘托底单，建议规避左侧抄底，等待缩量企稳信号。'
                              : '【震荡整理格局】资金参与度适中，量能与均量持平，更依赖结构性轮动机会。'}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">研报关联度: 42篇今日更新</span>
                  <button className="px-2.5 py-1 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-300 rounded text-xs transition">
                    导出个股清单
                  </button>
                </div>
              </div>
            </div>

            {/* Horizontal Ranking Bar Comparison */}
            <div className="bg-[#0d1322] border border-slate-800/80 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <BarChart3 className="h-4 w-4 text-emerald-400" />
                  <span>各板块资金成交额与涨跌幅全量横向矩阵</span>
                </span>
                <span className="text-xs text-slate-500">按成交额排序 (前 12 大行业)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sortedSectors.map((s, idx) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSector(s)}
                    className="p-3 bg-slate-900/80 hover:bg-slate-800/90 rounded-lg border border-slate-800 transition cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-mono text-slate-500 w-4">#{idx + 1}</span>
                        <span className="font-semibold text-slate-200 text-xs">{s.name}</span>
                      </div>
                      <span className={`text-xs font-mono font-bold ${formatDeltaClass(s.change)}`}>
                        {s.change > 0 ? `+${s.change}%` : `${s.change}%`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-2">
                      <span>成交: {s.totalAmount}亿</span>
                      <span className="text-amber-400">量比: {s.volumeRatio}</span>
                      <span className={formatDeltaClass(s.netMoneyInflow)}>
                        净流: {s.netMoneyInflow > 0 ? `+${s.netMoneyInflow}` : s.netMoneyInflow}亿
                      </span>
                    </div>

                    {/* Mini volume fill line */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        className="bg-cyan-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, (s.totalAmount / 1200) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* --- SECTION C: ANALYST CORE QUANT & SENTIMENT SUITE --- */}
        {(activeTab === 'overview' || activeTab === 'indicators') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between bg-[#0d1322] p-4 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">
                    分析师常用核心量化健康度 & 情绪指标库 (Quant Indicators)
                  </h2>
                  <p className="text-xs text-slate-400">
                    涵盖换手速度、极值情绪监控、涨跌停统计及破均线广度，用于辅助仓位择时与风险对冲。
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Market Temperature Dial */}
              <div className="bg-[#0d1322] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-slate-200">综合情绪温度计 (0-100)</span>
                    <Activity className="h-3.5 w-3.5 text-cyan-400" />
                  </div>
                  <div className="text-center my-4">
                    <div className="text-4xl font-black font-mono text-cyan-400">{marketTemp}°C</div>
                    <div className="text-xs text-slate-400 mt-1 font-medium">
                      状态: <span className="text-rose-400 font-bold">偏热·多头主导</span>
                    </div>
                  </div>
                  <div className="relative w-full h-3 bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 rounded-full">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-slate-900 rounded-full shadow-lg transition-all duration-300"
                      style={{ left: `calc(${marketTemp}% - 8px)` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
                    <span>冰点(0)</span>
                    <span>均衡(50)</span>
                    <span>过热(100)</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 mt-4 pt-2 border-t border-slate-800">
                  结合涨跌家数比、融资融券净买额及大盘动量综合生成。
                </div>
              </div>

              {/* 2. Above 20MA Stock Percentage (Breadth) */}
              <div className="bg-[#0d1322] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-slate-200">站上20日均线个股占比 (广度)</span>
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div className="text-center my-4">
                    <div className="text-4xl font-black font-mono text-emerald-400">64.2%</div>
                    <div className="text-xs text-slate-400 mt-1 font-medium">全市场 3420 / 5328 只</div>
                  </div>
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '64.2%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
                    <span>空头占优 (&lt;30%)</span>
                    <span>健康多头 (&gt;60%)</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 mt-4 pt-2 border-t border-slate-800">
                  当数值从极低值 (&lt;20%) 向上反弹时，往往对应中期市场大底。
                </div>
              </div>

              {/* 3. Margin Trading / Smart Money Leverage */}
              <div className="bg-[#0d1322] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-slate-200">两融杠杆买入动向 (杠杆资金)</span>
                    <DollarSign className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <div className="text-center my-4">
                    <div className="text-4xl font-black font-mono text-amber-400">+48.6 <span className="text-xs">亿</span></div>
                    <div className="text-xs text-slate-400 mt-1 font-medium">融资余额 16,842 亿元</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">融资买入占比:</span>
                      <span className="text-slate-200 font-mono">9.82% (连续3日上升)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">担保比例均值:</span>
                      <span className="text-emerald-400 font-mono">274% (处于安全区)</span>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 mt-4 pt-2 border-t border-slate-800">
                  反映激进散户与高净值游资风险偏好。
                </div>
              </div>

              {/* 4. Extreme Market Alert Box */}
              <div className="bg-[#0d1322] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-slate-200">量化风控预警信号</span>
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="p-2 rounded bg-rose-950/20 border border-rose-500/30 flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                      <div className="text-[11px]">
                        <span className="font-bold text-rose-300">科技板块局部过热:</span>
                        <p className="text-slate-400">算力/半导体换手率超过 6.5%，警惕高位获利盘对冲倒手。</p>
                      </div>
                    </div>
                    <div className="p-2 rounded bg-cyan-950/20 border border-cyan-500/30 flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                      <div className="text-[11px]">
                        <span className="font-bold text-cyan-300">宽基底盘坚固:</span>
                        <p className="text-slate-400">沪深300 ETF 连续 5 个交易日大额净申购，下方空间有限。</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 mt-4 pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span>系统对冲建议:</span>
                  <span className="text-amber-400 font-semibold">维持 75% 仓位</span>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* 4. STATUS FOOTER */}
      <footer className="border-t border-slate-800/80 bg-[#090d18] px-4 py-2.5 text-xs text-slate-500 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-medium">数据流引擎: 正常接入 (上海/深圳证券交易所行情源)</span>
          </span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline text-slate-500">ETF净值及申赎数据每日盘中连续测算</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-400">AlphaLens 智研终端</span>
          <button 
            onClick={() => window.print()}
            className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>导出研报快照</span>
          </button>
        </div>
      </footer>
    </div>
  );
}