import request from '@/utils/request'

export function addMeter({ addr, yhdz, organization, pn, vcaddr, gddw, tq, yhmc, yhabh, yhlb, zcbh, jldbh, sblb, sblx, ccbh, tysj, dhpc, zhbl, cbqd, xl, cz, eddy, bddl, zqd, sccj, jlzzfl, jlfs, zfbbz, jldwz, jlddz, scjyrq, txfs, txgw, ljdz, btl, jlbx, xgwzh, dbmm, deveui, appeui, ct, pt }) {
  return request({
    url: '/yhgx',
    method: 'post',
    data: {
      addr,
      yhdz,
      organization,
      pn,
      vcaddr,
      gddw,
      tq,
      yhmc,
      yhabh,
      yhlb,
      zcbh,
      jldbh,
      sblb,
      sblx,
      ccbh,
      tysj,
      dhpc,
      zhbl,
      cbqd,
      xl,
      cz,
      eddy,
      bddl,
      zqd,
      sccj,
      jlzzfl,
      jlfs,
      zfbbz,
      jldwz,
      jlddz,
      scjyrq,
      txfs,
      txgw,
      ljdz,
      btl,
      jlbx,
      xgwzh,
      dbmm,
      deveui,
      appeui,
      ct,
      pt
    }
  })
}
// 上传
export function update(table, requests) {
  return request({
    url: `/classes/${table}`,
    method: 'post',
    data: {
      requests
    }
  })
}
