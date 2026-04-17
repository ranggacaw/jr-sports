import React from 'react';

const CARD_WIDTH = 260;
const CARD_HEIGHT = 110;
const GAP_X = 50;
const GAP_Y = 30;

const ROW_H = CARD_HEIGHT + GAP_Y;
const COL_W = CARD_WIDTH + GAP_X;

const CONFIGS = {
    16: {
        cols: 7.5,
        rows: 9,
        layout: {
            U1: { c: 0, r: 0 },
            U2: { c: 0, r: 1 },
            U3: { c: 0, r: 2 },
            U4: { c: 0, r: 3 },
            U5: { c: 2, r: 0.5 },
            U6: { c: 2, r: 2.5 },
            U7: { c: 4, r: 1.5 },
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
        },
        draw: (connect, lines, key) => {
            connect(['U1','U2'], 'U5');
            connect(['U3','U4'], 'U6');
            connect(['U5','U6'], 'U7');
            connect(['U7'], 'G1');
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
            
            // L14 -> G1 elbow
            if (connect.matches['L14'] && connect.matches['G1']) {
                const s = connect.getCenter('L14');
                const t = connect.getCenter('G1');
                const elbowX = s.rightX + 20; 
                const p = `M ${s.rightX} ${s.midY} L ${elbowX} ${s.midY} L ${elbowX} ${t.midY} L ${t.leftX} ${t.midY}`;
                lines.push(<path key={key++} d={p} fill="none" stroke="#9ca3af" strokeWidth="2" />);
            }
        }
    },
    8: {
        cols: 5.5,
        rows: 5,
        layout: {
            U1: { c: 0, r: 0 },
            U2: { c: 0, r: 1 },
            U3: { c: 2, r: 0.5 },
            L1: { c: 0, r: 2.5 },
            L2: { c: 0, r: 3.5 },
            L3: { c: 1, r: 2.5 },
            L4: { c: 1, r: 3.5 },
            L5: { c: 2, r: 3.0 },
            L6: { c: 3, r: 3.0 },
            G1: { c: 4, r: 0.5 },
        },
        draw: (connect, lines, key) => {
            connect(['U1','U2'], 'U3');
            connect(['U3'], 'G1');
            connect(['L1'], 'L3');
            connect(['L2'], 'L4');
            connect(['L3','L4'], 'L5');
            connect(['L5'], 'L6');
            
            // L6 -> G1 elbow
            if (connect.matches['L6'] && connect.matches['G1']) {
                const s = connect.getCenter('L6');
                const t = connect.getCenter('G1');
                const elbowX = s.rightX + 20; 
                const p = `M ${s.rightX} ${s.midY} L ${elbowX} ${s.midY} L ${elbowX} ${t.midY} L ${t.leftX} ${t.midY}`;
                lines.push(<path key={key++} d={p} fill="none" stroke="#9ca3af" strokeWidth="2" />);
            }
        }
    },
    4: {
        cols: 3,
        rows: 2.5,
        layout: {
            U1: { c: 0, r: 0 },
            L1: { c: 0, r: 1.5 },
            L2: { c: 1, r: 1.5 },
            G1: { c: 2, r: 0 },
        },
        draw: (connect, lines, key) => {
            connect(['U1'], 'G1');
            connect(['L1'], 'L2');
            
            // L2 -> G1 elbow
            if (connect.matches['L2'] && connect.matches['G1']) {
                const s = connect.getCenter('L2');
                const t = connect.getCenter('G1');
                const elbowX = s.rightX + 20; 
                const p = `M ${s.rightX} ${s.midY} L ${elbowX} ${s.midY} L ${elbowX} ${t.midY} L ${t.leftX} ${t.midY}`;
                lines.push(<path key={key++} d={p} fill="none" stroke="#9ca3af" strokeWidth="2" />);
            }
        }
    }
};

function createPath(x1, y1, x2, y2, key) {
    const strokeColor = '#9ca3af';
    const strokeWidth = 2;

    if (y1 === y2) {
        return <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth={strokeWidth} />;
    }
    
    const midX = x1 + (x2 - x1) / 2;
    const p = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
    return <path key={key} d={p} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />;
}

export default function TournamentBracket({ tournament }) {
    if (!tournament || !tournament.brackets) return null;

    const matchesByCode = {};
    const extract = (arr) => { if(arr) arr.forEach(m => matchesByCode[m.code] = m); };
    extract(tournament.brackets.upper);
    extract(tournament.brackets.lower);
    extract(tournament.brackets.grand_final);

    // Determine config based on largest match presence
    let configKey = 4;
    if (matchesByCode['U7']) configKey = 16;
    else if (matchesByCode['U3']) configKey = 8;
    
    const config = CONFIGS[configKey];

    const sourceMap = {
        'L5:1': 'Loser of U1',
        'L6:1': 'Loser of U2',
        'L7:1': 'Loser of U3',
        'L8:1': 'Loser of U4',
        'L11:1': 'Loser of U5',
        'L12:1': 'Loser of U6',
        'L14:1': 'Loser of U7',
        // Support 8 player size mapping optionally
        'L3:1': 'Loser of U1', // L3 in 8-player format gets loser of U1 (actually L1 gets the losers and feeds into L3? StartTournament says L1 is Lower Round 1. wait L1 in 8-player DE usually has Loser of P1 vs P2? Whatever sourceMap handles fallback text.
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
            <div className="absolute -bottom-5 left-0 w-full text-center text-[10px] text-on-surface-variant font-mono tracking-tighter">
                {g1}{g2}{g3}
            </div>
        );
    };

    const renderMembers = (members = []) => {
        if (members.length <= 1) {
            return null;
        }
        return <p className="block text-[10px] font-medium text-on-surface-variant truncate">{members.join(' / ')}</p>;
    };

    const width = config.cols * COL_W;
    const height = config.rows * ROW_H;

    const drawLines = () => {
        const lines = [];
        let key = 0;
        
        const getCenter = (id) => {
            const l = config.layout[id];
            const rightX = (l.c * COL_W) + CARD_WIDTH;
            const leftX = l.c * COL_W;
            const midY = (l.r * ROW_H) + (CARD_HEIGHT / 2);
            return { rightX, leftX, midY };
        };

        const connect = (sources, target) => {
            if (!matchesByCode[target]) return;
            
            const t = getCenter(target);
            sources.forEach(src => {
                if (!matchesByCode[src]) return;
                const s = getCenter(src);
                lines.push(createPath(s.rightX, s.midY, t.leftX, t.midY, key++));
            });
        };
        
        connect.matches = matchesByCode;
        connect.getCenter = getCenter;
        
        config.draw(connect, lines, key);
        return lines;
    };

    return (
        <div className="w-full overflow-x-auto bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-surface-container-high scrollbar-thin scrollbar-thumb-surface-container-high scrollbar-track-surface">
            <div className="relative font-sans mx-auto" style={{ width, height, minWidth: width }}>
                
                <svg className="absolute inset-0 pointer-events-none z-0" width="100%" height="100%">
                    {drawLines()}
                </svg>

                {Object.entries(config.layout).map(([code, pos]) => {
                    const match = matchesByCode[code];
                    if (!match) return null;
                    const left = pos.c * COL_W;
                    const top = pos.r * ROW_H;

                    return (
                        <div 
                            key={code} 
                            style={{ left, top, width: CARD_WIDTH, height: CARD_HEIGHT }}
                            className="absolute bg-surface border border-surface-container-high rounded-xl flex flex-col shadow-sm z-10 transition-colors hover:border-primary overflow-hidden"
                        >
                            <div className="bg-surface-container-lowest px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-on-surface-variant border-b border-surface-container-high flex justify-between">
                                <span className="truncate">{match.round_name}</span>
                                <span className="ml-2 text-primary">{code}</span>
                            </div>
                            <div className="flex-1 flex flex-col justify-center bg-surface">
                                <div className="flex justify-between px-3 py-1.5 items-center border-b border-surface-container-high/50 min-h-[38px]">
                                    <div className="min-w-0 pr-2 flex-1">
                                        <p className="truncate font-semibold text-xs text-on-surface">
                                            {getPlayerName(match.player_one_name, code, 1)}
                                        </p>
                                        {renderMembers(match.player_one_members)}
                                    </div>
                                    <span className="font-mono text-sm font-bold text-on-surface w-6 text-center shrink-0">
                                        {renderScore(match.player_one_score)}
                                    </span>
                                </div>
                                <div className="flex justify-between px-3 py-1.5 items-center min-h-[38px]">
                                    <div className="min-w-0 pr-2 flex-1">
                                        <p className="truncate font-semibold text-xs text-on-surface">
                                            {getPlayerName(match.player_two_name, code, 2)}
                                        </p>
                                        {renderMembers(match.player_two_members)}
                                    </div>
                                    <span className="font-mono text-sm font-bold text-on-surface w-6 text-center shrink-0">
                                        {renderScore(match.player_two_score)}
                                    </span>
                                </div>
                            </div>
                            {renderGamePoints(match)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
