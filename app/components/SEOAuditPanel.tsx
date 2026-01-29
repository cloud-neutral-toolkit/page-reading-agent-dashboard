'use client';

import { useState } from 'react';
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info,
    Download,
    ExternalLink,
    TrendingUp,
    TrendingDown,
    Minus
} from 'lucide-react';

interface SEOAuditResult {
    summary: {
        url: string;
        timestamp: string;
        overallScore: number;
        duration: number;
        status: 'excellent' | 'good' | 'needs_improvement' | 'poor';
    };
    scores: {
        metadata: number;
        headings: number;
        images: number;
        links: number;
        structuredData: number;
        mobile: number;
        overall: number;
    };
    issues: {
        critical: number;
        warnings: number;
        suggestions: number;
        details: {
            critical: Array<{ type: string; message: string }>;
            warnings: Array<{ type: string; message: string }>;
            suggestions: Array<{ type: string; message: string }>;
        };
    };
    details: any;
}

interface SEOAuditPanelProps {
    result: SEOAuditResult | any | null;
    loading: boolean;
}

export default function SEOAuditPanel({ result, loading }: SEOAuditPanelProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'details'>('overview');

    if (loading) {
        return (
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center space-y-4">
                        <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-slate-400">Analyzing SEO...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="text-center text-slate-400 py-12">
                    <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Run an SEO audit to see results here</p>
                </div>
            </div>
        );
    }

    // Handle error state from API
    if (result.status === 'error' || !result.summary) {
        return (
            <div className="bg-slate-800/50 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6">
                <div className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-400 mb-2">Audit Failed</h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                        {result.error || result.message || "An unexpected error occurred while performing the SEO audit."}
                    </p>
                    <div className="mt-4 text-xs text-slate-500 bg-slate-900/50 p-3 rounded font-mono inline-block">
                        {JSON.stringify(result, null, 2)}
                    </div>
                </div>
            </div>
        );
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        if (score >= 40) return 'text-orange-400';
        return 'text-red-400';
    };

    const getScoreIcon = (score: number) => {
        if (score >= 80) return <TrendingUp className="h-5 w-5" />;
        if (score >= 60) return <Minus className="h-5 w-5" />;
        return <TrendingDown className="h-5 w-5" />;
    };

    const exportReport = () => {
        const dataStr = JSON.stringify(result, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `seo-audit-${new Date().toISOString()}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const exportMarkdown = () => {
        let md = `# SEO Audit Report\n\n`;
        md += `**URL**: ${result.summary.url}\n`;
        md += `**Date**: ${new Date(result.summary.timestamp).toLocaleString()}\n`;
        md += `**Overall Score**: ${result.summary.overallScore}/100 (${result.summary.status})\n\n`;

        md += `## Scores\n\n`;
        md += `| Category | Score |\n`;
        md += `|----------|-------|\n`;
        Object.entries(result.scores).forEach(([key, value]) => {
            if (key !== 'overall') {
                md += `| ${key.charAt(0).toUpperCase() + key.slice(1)} | ${value}/100 |\n`;
            }
        });

        md += `\n## Issues\n\n`;
        md += `- **Critical**: ${result.issues.critical}\n`;
        md += `- **Warnings**: ${result.issues.warnings}\n`;
        md += `- **Suggestions**: ${result.issues.suggestions}\n\n`;

        if (result.issues.details.critical.length > 0) {
            md += `### Critical Issues\n\n`;
            result.issues.details.critical.forEach((issue: any) => {
                md += `- ${issue.message}\n`;
            });
            md += `\n`;
        }

        if (result.issues.details.warnings.length > 0) {
            md += `### Warnings\n\n`;
            result.issues.details.warnings.forEach((issue: any) => {
                md += `- ${issue.message}\n`;
            });
            md += `\n`;
        }

        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `seo-audit-${new Date().toISOString()}.md`;
        link.click();
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="border-b border-slate-700/50 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-200">SEO Audit Results</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={exportMarkdown}
                            className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-xs text-slate-300 flex items-center gap-1 transition-all"
                        >
                            <Download className="h-3 w-3" />
                            MD
                        </button>
                        <button
                            onClick={exportReport}
                            className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-xs text-slate-300 flex items-center gap-1 transition-all"
                        >
                            <Download className="h-3 w-3" />
                            JSON
                        </button>
                    </div>
                </div>

                {/* Overall Score */}
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-4xl font-bold ${getScoreColor(result.summary.overallScore)}`}>
                                {result.summary.overallScore}
                            </span>
                            <span className="text-slate-500">/100</span>
                            {getScoreIcon(result.summary.overallScore)}
                        </div>
                        <p className="text-sm text-slate-400 capitalize">{result.summary.status.replace('_', ' ')}</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                        <div className="text-center">
                            <div className="text-red-400 font-semibold">{result.issues.critical}</div>
                            <div className="text-slate-500 text-xs">Critical</div>
                        </div>
                        <div className="text-center">
                            <div className="text-yellow-400 font-semibold">{result.issues.warnings}</div>
                            <div className="text-slate-500 text-xs">Warnings</div>
                        </div>
                        <div className="text-center">
                            <div className="text-blue-400 font-semibold">{result.issues.suggestions}</div>
                            <div className="text-slate-500 text-xs">Suggestions</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-700/50">
                <div className="flex">
                    {(['overview', 'issues', 'details'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${activeTab === tab
                                ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-700/30'
                                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/20'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
                {activeTab === 'overview' && (
                    <div className="space-y-4">
                        {Object.entries(result.scores).map(([key, value]) => {
                            if (key === 'overall') return null;
                            const scoreValue = value as number;
                            return (
                                <div key={key} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className={`font-semibold ${getScoreColor(scoreValue)}`}>{scoreValue}/100</span>
                                    </div>
                                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${scoreValue >= 80 ? 'bg-green-500' :
                                                scoreValue >= 60 ? 'bg-yellow-500' :
                                                    scoreValue >= 40 ? 'bg-orange-500' :
                                                        'bg-red-500'
                                                }`}
                                            style={{ width: `${scoreValue}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'issues' && (
                    <div className="space-y-6">
                        {result.issues.details.critical.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                                    <XCircle className="h-4 w-4" />
                                    Critical Issues
                                </h3>
                                <div className="space-y-2">
                                    {result.issues.details.critical.map((issue: any, idx: number) => (
                                        <div key={idx} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-300">
                                            {issue.message}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.issues.details.warnings.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    Warnings
                                </h3>
                                <div className="space-y-2">
                                    {result.issues.details.warnings.map((issue: any, idx: number) => (
                                        <div key={idx} className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm text-yellow-300">
                                            {issue.message}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.issues.details.suggestions.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    Suggestions
                                </h3>
                                <div className="space-y-2">
                                    {result.issues.details.suggestions.map((issue: any, idx: number) => (
                                        <div key={idx} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-300">
                                            {issue.message}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'details' && (
                    <div className="space-y-4 text-sm">
                        <div>
                            <h4 className="text-slate-400 font-semibold mb-2">Metadata</h4>
                            <div className="bg-slate-900/50 rounded-lg p-3 space-y-1 text-xs">
                                <div><span className="text-slate-500">Title:</span> <span className="text-slate-300">{result.details.metadata?.title || 'N/A'}</span></div>
                                <div><span className="text-slate-500">Description:</span> <span className="text-slate-300">{result.details.metadata?.description || 'N/A'}</span></div>
                                <div><span className="text-slate-500">Canonical:</span> <span className="text-slate-300">{result.details.metadata?.canonical || 'N/A'}</span></div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-slate-400 font-semibold mb-2">Images</h4>
                            <div className="bg-slate-900/50 rounded-lg p-3 space-y-1 text-xs">
                                <div><span className="text-slate-500">Total:</span> <span className="text-slate-300">{result.details.images?.total || 0}</span></div>
                                <div><span className="text-slate-500">With Alt:</span> <span className="text-green-400">{result.details.images?.withAlt || 0}</span></div>
                                <div><span className="text-slate-500">Without Alt:</span> <span className="text-red-400">{result.details.images?.withoutAlt || 0}</span></div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-slate-400 font-semibold mb-2">Links</h4>
                            <div className="bg-slate-900/50 rounded-lg p-3 space-y-1 text-xs">
                                <div><span className="text-slate-500">Total:</span> <span className="text-slate-300">{result.details.links?.total || 0}</span></div>
                                <div><span className="text-slate-500">Internal:</span> <span className="text-blue-400">{result.details.links?.internal || 0}</span></div>
                                <div><span className="text-slate-500">External:</span> <span className="text-purple-400">{result.details.links?.external || 0}</span></div>
                                <div><span className="text-slate-500">Dead Links:</span> <span className="text-red-400">{result.details.links?.deadLinks?.length || 0}</span></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
