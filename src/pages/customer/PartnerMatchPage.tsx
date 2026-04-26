import React, { useMemo } from 'react';
import { FiUsers, FiMail, FiPhone, FiExternalLink, FiTag, FiTrendingUp } from 'react-icons/fi';
import { matchScores, users, profiles, profileSkills, profileInterests, tags } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const PartnerMatchPage: React.FC = () => {
  const { user } = useAuth();

  const matches = useMemo(() => {
    return matchScores.filter(m => m.profile_user_id === user?.id).sort((a, b) => b.score - a.score).map(m => {
      const matchedUser = users.find(u => u.id === m.matched_user_id);
      const matchedProfile = profiles.find(p => p.user_id === m.matched_user_id);
      const skills = profileSkills.filter(ps => ps.profile_user_id === m.matched_user_id).map(ps => ({ ...ps, tag: tags.find(t => t.id === ps.tag_id) }));
      const interests = profileInterests.filter(pi => pi.profile_user_id === m.matched_user_id).map(pi => ({ ...pi, tag: tags.find(t => t.id === pi.tag_id) }));
      return { ...m, user: matchedUser, profile: matchedProfile, skills, interests };
    });
  }, [user]);

  const scoreColor = (score: number) => score >= 0.8 ? 'text-success' : score >= 0.6 ? 'text-warning' : 'text-muted-foreground';

  const scoreBar = (score: number) => (
    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500"
        style={{ width: `${score * 100}%`, background: score >= 0.8 ? 'hsl(var(--success))' : score >= 0.6 ? 'hsl(var(--warning))' : 'hsl(var(--muted-foreground))' }} />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Kết nối cộng đồng</p>
        <h1 className="text-xl font-bold font-heading mt-1">Đối tác tiềm năng</h1>
        <p className="text-sm text-muted-foreground mt-1">Hệ thống gợi ý đối tác dựa trên kỹ năng, lĩnh vực và mối quan tâm chung</p>
      </div>

      {matches.length === 0 ? (
        <div className="rounded-xl border border-border bg-card text-center py-16 p-6">
          <FiUsers className="h-16 w-16 mx-auto text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">Chưa có gợi ý</p>
          <p className="mt-2 text-sm text-muted-foreground">Cập nhật kỹ năng và lĩnh vực quan tâm để hệ thống tìm đối tác phù hợp</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {matches.map(m => (
            <div key={m.matched_user_id} className="rounded-xl border border-border bg-card p-6 card-interactive">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-bold shrink-0">
                  {m.user?.full_name?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg">{m.user?.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{m.profile?.profession} · {m.profile?.company}</p>
                  {m.profile?.bio && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{m.profile.bio}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-2xl font-bold ${scoreColor(m.score)}`}>{Math.round(m.score * 100)}%</p>
                  <p className="text-xs text-muted-foreground">Phù hợp</p>
                </div>
              </div>

              <div className="mt-4">{scoreBar(m.score)}</div>

              <div className="mt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2"><FiTrendingUp className="inline h-3 w-3 mr-1" /> Lý do phù hợp</p>
                <div className="flex flex-wrap gap-2">{m.reasons_json.map((reason, i) => <span key={i} className="badge badge-info">{reason}</span>)}</div>
              </div>

              {m.skills.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2"><FiTag className="inline h-3 w-3 mr-1" /> Kỹ năng</p>
                  <div className="flex flex-wrap gap-2">
                    {m.skills.map(sk => sk.tag && <span key={sk.tag_id} className="badge badge-neutral">{sk.tag.name}<span className="ml-1 text-amber-500">{'★'.repeat(sk.level)}</span></span>)}
                  </div>
                </div>
              )}

              {m.profile?.contact_public ? (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Liên hệ</p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    {m.profile.contact_email && <a href={`mailto:${m.profile.contact_email}`} className="flex items-center gap-1 text-primary hover:underline"><FiMail className="h-3.5 w-3.5" /> {m.profile.contact_email}</a>}
                    {m.profile.contact_phone && <span className="flex items-center gap-1 text-muted-foreground"><FiPhone className="h-3.5 w-3.5" /> {m.profile.contact_phone}</span>}
                    {m.profile.contact_link && <a href={m.profile.contact_link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:underline"><FiExternalLink className="h-3.5 w-3.5" /> Profile</a>}
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground italic">Thông tin liên hệ đã được ẩn bởi người dùng</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnerMatchPage;
