import { kdTree } from 'kd-tree-javascript';
import throttle from '@/utils/throttle';
import { sortNearestPoints } from '@/utils/chart';
import type { Color, Point } from 'chart.js';
import type {
  ChartWithTooltip,
  NearestPoint,
  ChartEventArgs,
  CustomTooltip,
} from '@/types';

import { createStore } from 'zustand/vanilla';
import { combine } from 'zustand/middleware';

const defaultTooltipState: CustomTooltip = {
  active: false,
  freeze: false,
  x: 0,
  y: 0,
  xAxisPos: 0,
  yAxisPos: 0,
} as const;

const tooltipStore = createStore(
  combine(
    {
      tooltip: { ...defaultTooltipState },
      xAxis: [0, 0],
    },
    (set, get) => ({
      setFreeze: (freeze: boolean) =>
        set((state) => {
          const newState = { ...state };
          newState.tooltip.freeze = freeze;
          return newState;
        }),
      update: (tooltip: CustomTooltip) => set({ tooltip }),
      reset: () => set({ tooltip: { ...defaultTooltipState } }),
      setXAxis: (from: number, to: number) => {
        const currentState = get().xAxis;
        if (currentState[0] !== from || currentState[1] !== to) {
          set({ xAxis: [from, to] });
          set({ tooltip: { ...defaultTooltipState } });
        }
      },
    }),
  ),
);

const drawVerticalLine = (
  chart: ChartWithTooltip,
  xPos: number | undefined,
): void => {
  if (xPos === undefined) {
    return;
  }

  const ctx = chart.ctx;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(xPos, chart.chartArea.top);
  ctx.lineTo(xPos, chart.chartArea.bottom);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.stroke();
  ctx.restore();
};

const drawCirclePoint = (chart: ChartWithTooltip, point: NearestPoint): void => {
  const pointX = chart.scales.x.getPixelForValue(point.x);
  const pointY = chart.scales.y.getPixelForValue(point.y);

  const ctx = chart.ctx;
  ctx.save();
  ctx.beginPath();
  ctx.arc(pointX, pointY, 6, 0, Math.PI * 2);
  ctx.fillStyle = point.backgroundColor;
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#fff';
  ctx.stroke();
  ctx.fill();
  ctx.restore();
};

const drawTooltipContainer = (
  chart: ChartWithTooltip,
  nearestPoints: NearestPoint[],
): void => {
  const ctx = chart.ctx;
  const tooltip = tooltipStore.getState().tooltip;

  if (nearestPoints?.length === 0) {
    return;
  }

  const maxHeight = chart.chartArea.bottom - chart.chartArea.top - 20;
  const tooltipDefaultWidth = 200;
  const baseFont = '14px Arial';
  const iconFont = '22px Arial';

  const pointLeftPadding = 10;
  const pointRightPadding = 10;
  const pointTopPadding = 10;
  const pointMarkerWidth = 10;
  const pointMarkerHeight = 10;

  const getPointText = (point: NearestPoint) =>
    `${point.label}: ${point.y.toFixed(2)}`;

  const pointWidthList = nearestPoints.map((point: NearestPoint) => {
    ctx.font = baseFont;
    return (
      ctx.measureText(getPointText(point)).width +
      (pointLeftPadding * 2 + pointMarkerWidth + pointRightPadding)
    );
  });

  const tooltipWidth = Math.max(tooltipDefaultWidth, ...pointWidthList);

  let tooltipX = tooltip.x + 10;
  if (tooltipX + tooltipWidth > chart.chartArea.right) {
    tooltipX = tooltip.x - tooltipWidth - 10;
  }
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  const tooltipHeight = Math.min(maxHeight, 30 + nearestPoints.length * 20);
  const tooltipY =
    tooltip.y + tooltipHeight < chart.chartArea.bottom
      ? tooltip.y + 10
      : (chart.chartArea.bottom - tooltipHeight) / 2;
  ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

  ctx.fillStyle = '#fff';
  ctx.font = iconFont;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('⏱️', tooltipX + 6, tooltipY + 15);

  ctx.font = baseFont;
  const time = tooltip.xAxisPos.toFixed(3);
  ctx.fillText(`: ${time} sec.`, tooltipX + 26, tooltipY + 15);

  if (tooltip.freeze) {
    ctx.textAlign = 'right';
    ctx.font = iconFont;
    ctx.fillText('❄️', tooltipX + tooltipWidth - 6, tooltipY + 18);
  }

  const pointStartY = tooltipY + 30;
  nearestPoints.forEach((point: NearestPoint, index: number) => {
    // Draw point if height of tooltip is enough
    if (40 + index * 20 > tooltipHeight) {
      return;
    }

    const topPadding = index * (pointTopPadding + pointMarkerHeight);
    ctx.textAlign = 'left';
    ctx.font = baseFont;

    // point color marker
    ctx.fillStyle = point.color;
    ctx.fillRect(
      tooltipX + pointLeftPadding,
      pointStartY + topPadding,
      pointMarkerWidth,
      pointMarkerHeight,
    );
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(
      tooltipX + pointLeftPadding,
      pointStartY + topPadding,
      pointMarkerWidth,
      pointMarkerHeight,
    );

    // point text
    ctx.fillStyle = '#fff';
    ctx.fillText(
      getPointText(point),
      tooltipX + pointLeftPadding * 2 + pointMarkerWidth,
      pointStartY + 5 + topPadding,
    );
  });
};

const getNearestPoints = (
  chart: ChartWithTooltip,
  xPos: number | undefined,
): NearestPoint[] => {
  if (xPos === undefined) {
    return [];
  }

  const distanceX = (a: Point, b: Point) => Math.abs(a.x - b.x);

  const nearestPoints = [];
  for (const datasetIndex in chart.data.datasets) {
    if (!chart.isDatasetVisible(Number(datasetIndex))) {
      continue;
    }

    const dataset = chart.data.datasets[datasetIndex];
    if (dataset?.data?.length < 1) {
      return [];
    }

    const tree = new kdTree(dataset?.data as Point[], distanceX, ['x']);
    const nearest = tree.nearest({ x: xPos, y: 0 }, 1);
    const nearestPoint: Point = nearest[0][0];

    nearestPoints.push({
      label: dataset.label,
      x: nearestPoint?.x,
      y: nearestPoint?.y,
      color: dataset.borderColor as Color,
      backgroundColor: dataset.backgroundColor as Color,
    });
  }
  return sortNearestPoints(nearestPoints);
};

const handleSetTooltipData = throttle(
  (chart: ChartWithTooltip, args: ChartEventArgs): void => {
    const tooltip = tooltipStore.getState().tooltip;
    const eventType = args?.event?.type;
    const inChartArea = args?.inChartArea;

    if (inChartArea && eventType === 'click') {
      if (tooltip.active && !tooltip.freeze) {
        tooltipStore.getState().setFreeze(true);
      } else {
        tooltipStore.getState().reset();
      }
      return;
    }

    if (tooltip.freeze) {
      return;
    }

    if (inChartArea && eventType === 'mousemove') {
      tooltip.x = args.event.x ?? 0;
      tooltip.y = args.event.y ?? 0;
      tooltip.xAxisPos = chart.scales.x.getValueForPixel(tooltip.x) ?? 0;
      tooltip.yAxisPos = chart.scales.y.getValueForPixel(tooltip.y) ?? 0;
      tooltip.freeze = false;
      tooltip.active = true;

      tooltipStore.getState().update(tooltip);
    }
  },
  5,
);

const customTooltipPlugin = {
  id: 'customTooltip',

  afterLayout(chart: ChartWithTooltip): void {
    setTimeout(() => {
      tooltipStore
        .getState()
        .setXAxis(chart?.scales?.x?.min, chart?.scales?.x?.max);
    }, 1);

    if (chart._customTooltipSubscription == null) {
      const draw = throttle(() => chart.draw(), 10);
      chart._customTooltipSubscription = tooltipStore.subscribe(() => {
        if (chart.ctx != null) {
          draw();
        }
      });
    }
  },

  afterDestroy(chart: ChartWithTooltip): void {
    if (chart._customTooltipSubscription != null) {
      chart._customTooltipSubscription();
    }
  },

  afterDraw: (chart: ChartWithTooltip): void => {
    const tooltip = tooltipStore.getState().tooltip;
    if (!tooltip.active) {
      return;
    }

    const lineX = chart.scales.x.getPixelForValue(tooltip.xAxisPos);
    drawVerticalLine(chart, lineX);

    const nearestPoints = getNearestPoints(chart, tooltip.xAxisPos);
    if (nearestPoints?.length) {
      nearestPoints.forEach((point) => drawCirclePoint(chart, point));
      drawTooltipContainer(chart, nearestPoints);
    }
  },

  afterEvent(chart: ChartWithTooltip, args: ChartEventArgs): void {
    const tooltip = tooltipStore.getState().tooltip;
    const eventType = args?.event?.type;
    const inChartArea = args?.inChartArea;

    if (
      (
        eventType === 'mouseout' ||
        (eventType === 'mousemove' && !inChartArea)
      ) &&
      tooltip.active &&
      !tooltip.freeze
    ) {
      setTimeout(() => tooltipStore.getState().reset(), 1);
      return;
    }

    handleSetTooltipData(chart, args);
  },
};

export default customTooltipPlugin;
