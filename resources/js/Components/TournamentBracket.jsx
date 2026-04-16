import React from 'react';

const CARD_WIDTH = 220;
const CARD_HEIGHT = 80;
const GAP_X = 50;
const GAP_Y = 25;

const ROW_H = CARD_HEIGHT + GAP_Y;
const COL_W = CARD_WIDTH + GAP_X;

const LAYOUT = {
    // Upper Bracket
    U1: { c: 0, r: 0 },
    U2: { c: 0, r: 1 },
    U3: { c: 0, r: 2 },
    U4: { c: 0, r: 3 },

    U5: { c: 2, r: 0.5 },
    U6: { c: 2, r: 2.5 },

    U7: { c: 4, r: 1.5 },

    // Lower Bracket uses offset row 5
    L1: { c: 0, r: 4.5 },
    L2: { c: 0, r: 5.5 },
    L3: { c: 0, r: 6.5 },
    L4: { c: 0, r: 7.5 },

    L5: { c: 1, r: 4.5 },
    L6: { c: 1, r: 5.5 },
    L7: { c: 1, r: 6.5 },
    L8: { c: 1, r: 7.5 },

    L9:  { c: 2, r: 5.0 },
    L10: { c: 2, r: 7.0 },

    L11: { c: 3, r: 5.0 },
    L12: { c: 3, r: 7.0 },

    L13: { c: 4, r: 6.0 },

    L14: { c: 5, r: 6.0 },

    G1: { c: 6, r: 1.5 },
};

function getCenter(id) {
    const l = LAYOUT[id];
    const rightX = (l.c * COL_W) + CARD_WIDTH;
    const leftX = l.c * COL_W;
    const midY = (l.r * ROW_H) + (CARD_HEIGHT / 2);
    return { rightX, leftX, midY };
}

function createPath(x1, y1, x2, y2, key) {
    const strokeColor = '#4B5563'; 
    const strokeWidth = 2;

    if (y1 === y2) {
        return <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth={strokeWidth} />;
    }
    
    const midX = x1 + (x2 - x1) / 2;
    const p = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
    return <path key={key} d={p} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />;
}

function drawLines() {
    const lines = [];
    let key = 0;

    const connect = (sources, target) => {
        const t = getCenter(target);
        sources.forEach(src => {
            const s = getCenter(src);
            lines.push(createPath(s.rightX, s.midY, t.leftX, t.midY, key++));
        });
    };

    // UB
    connect(['U1','U2'], 'U5');
    connect(['U3','U4'], 'U6');
    connect(['U5','U6'], 'U7');
    connect(['U7'], 'G1');

    // LB
    connect(['L1'], 'L5');
    connect(['L2'], 'L6');
    connect(['L3'], 'L7');
    connect(['L4'], 'L8');
    
    connect(['L5','L6'], 'L9');
    connect(['L7','L8'], 'L10');
    
    connect(['L9'], 'L11');
    connect(['L10'], 'L12');

    connect(['L11','L12'], 'L13');
    connect(['L13'], 'L14');

    // L14 to G1 requires custom elbow path so it doesn't cross UB lines awkwardly
    const s = getCenter('L14');
    const t = getCenter('G1');
    const elbowX = s.rightX + 20; 
    const p = `M ${s.rightX} ${s.midY} L ${elbowX} ${s.midY} L ${elbowX} ${t.midY} L ${t.leftX} ${t.midY}`;
    lines.push(<path key={key++} d={p} fill="none" stroke="#4B5563" strokeWidth="2" />);

    return lines;
}

export default function TournamentBracket({ tournament }) {
    if (!tournament || !tournament.brackets) return null;

    const matchesByCode = {};
    const extract = (arr) => { if(arr) arr.forEach(m => matchesByCode[m.code] = m); };
    extract(tournament.brackets.upper);
    extract(tournament.brackets.lower);
    extract(tournament.brackets.grand_final);

    // Map the source of TBD players from Upper bracket to Lower bracket slots
    const sourceMap = {
        'L5:1': 'Loser of U1',
        'L6:1': 'Loser of U2',
        'L7:1': 'Loser of U3',
        'L8:1': 'Loser of U4',
        'L11:1': 'Loser of U5',
        'L12:1': 'Loser of U6',
        'L14:1': 'Loser of U7'
    };

    const getPlayerName = (name, code, slot) => {
        if (name && name !== 'TBD') return name;
        return sourceMap[`${code}:${slot}`] || 'TBD';
    };

    const renderScore = (score) => {
        if (score === 0 || score === '0') return 0;
        return score ?? '-';
    };

    const renderGamePoints = (match) => {
        if (match.g1_p1_score == null) return null;
        const g1 = `${match.g1_p1_score}-${match.g1_p2_score}`;
        const g2 = match.g2_p1_score != null ? `, ${match.g2_p1_score}-${match.g2_p2_score}` : '';
        const g3 = match.g3_p1_score != null ? `, ${match.g3_p1_score}-${match.g3_p2_score}` : '';
        return (
            <div className="absolute -bottom-5 left-0 w-full text-center text-[10px] text-gray-400 font-mono tracking-tighter">
                {g1}{g2}{g3}
            </div>
        );
    };

    const width = 7.5 * COL_W;
    const height = 9 * ROW_H;

    return (
        <div className="w-full overflow-x-auto bg-[#0f172a] p-8 rounded-2xl shadow-xl border border-gray-800 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            <div className="relative font-sans mx-auto" style={{ width, height, minWidth: width }}>
                
                <svg className="absolute inset-0 pointer-events-none z-0" width="100%" height="100%">
                    {drawLines()}
                </svg>

                {Object.entries(LAYOUT).map(([code, pos]) => {
                    const match = matchesByCode[code];
                    if (!match) return null;
                    const left = pos.c * COL_W;
                    const top = pos.r * ROW_H;

                    return (
                        <div 
                            key={code} 
                            style={{ left, top, width: CARD_WIDTH, height: CARD_HEIGHT }}
                            className="absolute bg-[#1e293b] border border-gray-700 rounded-md flex flex-col shadow-lg z-10 transition-colors hover:border-blue-500 overflow-hidden"
                        >
                            <div className="bg-[#0f172a] px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-gray-400 border-b border-gray-700 flex justify-between">
                                <span className="truncate">{match.round_name}</span>
                                <span className="ml-2 text-blue-400">{code}</span>
                            </div>
                            <div className="flex-1 flex flex-col justify-center bg-gradient-to-b from-[#1e293b] to-[#0f172a]/50">
                                <div className="flex justify-between px-3 py-1 items-center border-b border-gray-700/50">
                                    <span className="truncate pr-2 font-semibold text-xs text-gray-200">
                                        {getPlayerName(match.player_one_name, code, 1)}
                                    </span>
                                    <span className="font-mono text-xs font-bold text-white w-6 text-center">
                                        {renderScore(match.player_one_score)}
                                    </span>
                                </div>
                                <div className="flex justify-between px-3 py-1 items-center">
                                    <span className="truncate pr-2 font-semibold text-xs text-gray-200">
                                        {getPlayerName(match.player_two_name, code, 2)}
                                    </span>
                                    <span className="font-mono text-xs font-bold text-white w-6 text-center">
                                        {renderScore(match.player_two_score)}
                                    </span>
                                </div>
                            </div>                            {renderGamePoints(match)}                        </div>
                    );
                })}
            </div>
        </div>
    );
}
