class Interpolation{
    dots = [];

    genTerms(dots){
        let termsFunctions = [];

        let dot;
        let derivativeW;
        let parent = this;
        for(let pos in dots){
            dot = dots[pos];

            termsFunctions.push(function (x){
                let derivativeW = parent.calcDerivativeW(dots,pos);
                let wArr = parent.calcW(x,dots,pos);

                let expression = '('+wArr[1]+' / ('+derivativeW.toFixed(6)+')) * '+dots[pos][1].toFixed(6);
                let value = (wArr[0]*dots[pos][1])/(derivativeW);

                return [value,expression];
            });
        }

        return termsFunctions;
    }

    evaluate(x){
        let terms = this.genTerms(this.dots);

        let expression1 = [];
        let expression2 = [];

        let sum = 0;

        let res;
        for(let termF of terms){
            res = termF(x);
            sum += res[0];
            expression1.push(res[1]);
            expression2.push(res[0].toFixed(6));
        }

        let expression = expression1.join(' + ') + ' = ' + expression2.join(' + ') + ' = ' + sum.toFixed(6);

        return [sum,expression];
    }

    calcW(x,dots,pos){
        let mul = 1;
        let expressions = [];
        let dot;
        for(let dotPos in dots){
            if(dotPos===pos) continue;
            dot = dots[dotPos];
            mul *= x-dot[0];
            expressions.push('(x - '+dot[0].toFixed(6)+')');
        }

        return [mul,expressions.join(' * ')];
    }

    calcDerivativeW(dots,pos){
        let mul = 1;
        let dot;
        let x0 = dots[pos][0];
        for(let dotPos in dots){
            if(dotPos!==pos){
                dot = dots[dotPos];
                mul *= x0-dot[0];
            }
        }

        return mul;
    }

    setDots(dots){
        this.dots = dots;
    }

}

function getXRange(dots){
    let start;
    let end;
    for(let dot of dots){
        if(start===undefined || start>dot[0]){
            start = dot[0];
        }
        if(end===undefined || end<dot[0]){
            end = dot[0];
        }
    }

    return [start,end];
}

function genChartData(dots,aimFunc,step=0.1,xName='X',firstCol='Y(X)',secondCol='G(X)'){
    let interpolation = new Interpolation();
    interpolation.setDots(dots);

    let xRange = getXRange(dots);

    let chartData = [
        [xName,firstCol,secondCol],
    ];
    
    let aimValue;
    let interpolated;


    for(let x = xRange[0]; x<=xRange[1]+step; x+=step){
        aimValue = aimFunc(x);
        interpolated = interpolation.evaluate(x);
        chartData.push([x,aimValue,interpolated[0]]);
    }

    return chartData;
}

function aim(x){
    return Math.cos(x);
    // return Math.pow(x,3) - 4*Math.pow(x,2) + 10*x -10;
}

function genDotsCollection(x1,x2,step=0.5,func){
    let dots = [];
    for(let x = x1;x<=x2+step;x+=step){
        dots.push([x,func(x)]);
    }

    return dots;
}

function drawChart(chartData,chartName='Интерполяция по формуле Лагранжа',elementId='curve_chart') {
    var data = google.visualization.arrayToDataTable(chartData);

    var options = {
        title: chartName,
        curveType: 'function',
        legend: { position: 'right' },
        hAxis: {
            title: 'X'
        },
        vAxis: {
            textPosition: 'top'
        },
    };

    var chart = new google.visualization.LineChart(document.getElementById(elementId));

    chart.draw(data, options);
}

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(showCharts);

function showCharts(){
    let dotsCollection;
    let chartData;

    dotsCollection = genDotsCollection(0,10,2,aim);
    chartData = genChartData(dotsCollection,aim,0.1,'X','COS(X)');
    drawChart(chartData,'Интерполяция по формуле Лагранжа для '+dotsCollection.length+' точек','curve_chart_1');

    dotsCollection = genDotsCollection(0,10,1.5,aim);
    chartData = genChartData(dotsCollection,aim,0.1,'X','COS(X)');
    drawChart(chartData,'Интерполяция по формуле Лагранжа для '+dotsCollection.length+' точек','curve_chart_2');

    dotsCollection = genDotsCollection(0,10,1.0,aim);
    chartData = genChartData(dotsCollection,aim,0.1,'X','COS(X)');
    drawChart(chartData,'Интерполяция по формуле Лагранжа для '+dotsCollection.length+' точек','curve_chart_3');

    dotsCollection = genDotsCollection(0,10,2.6,aim); // Шаг изменен на 2.5
    chartData = genChartData(dotsCollection,aim,0.1,'X','COS(X)');
    drawChart(chartData,'Интерполяция по формуле Лагранжа для '+dotsCollection.length+' точек','curve_chart_4');
}