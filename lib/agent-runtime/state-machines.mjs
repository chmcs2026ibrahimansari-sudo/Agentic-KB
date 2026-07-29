// State machines for bus items, standards, rewrites.

export const MACHINES = {
  bus: {
    initial: 'draft',
    transitions: {
      draft:        ['open', 'rejected', 'archived'],
      open:         ['acknowledged', 'in_progress', 'resolved', 'promoted', 'rejected', 'archived'],
      acknowledged: ['in_progress', 'resolved', 'promoted', 'rejected', 'archived'],
      in_progress:  ['resolved', 'promoted', 'rejected', 'archived'],
      resolved:     ['promoted', 'archived'],
      promoted:     ['archived'],
      rejected:     ['archived'],
      archived:     [],
    },
  },
  standards: {
    initial: 'draft',
    transitions: {
      draft:      ['proposed', 'archived'],
      proposed:   ['approved', 'rejected', 'archived'],
      approved:   ['active', 'archived'],
      active:     ['superseded', 'archived'],
      superseded: ['archived'],
      rejected:   ['archived'],
      archived:   [],
    },
  },
  rewrite: {
    initial: 'draft',
    transitions: {
      draft:        ['submitted', 'withdrawn'],
      submitted:    ['under_review', 'withdrawn'],
      under_review: ['approved', 'rejected', 'withdrawn'],
      approved:     ['merged', 'withdrawn'],
      merged:       ['archived'],
      rejected:     ['archived'],
      withdrawn:    ['archived'],
      archived:     [],
    },
  },
}

export function canTransition(machine, from, to) {
  // Own-property lookups: `from` comes from file frontmatter, so a crafted
  // status like "constructor" or "toString" would otherwise resolve to
  // inherited Object.prototype members and throw a TypeError instead of
  // being rejected as an illegal transition.
  const m = Object.hasOwn(MACHINES, machine) ? MACHINES[machine] : null
  if (!m) throw new Error(`Unknown state machine: ${machine}`)
  const allowed = Object.hasOwn(m.transitions, from) ? m.transitions[from] : []
  return allowed.includes(to)
}

export function transition(machine, currentState, toState, actor) {
  if (!Object.hasOwn(MACHINES, machine)) throw new Error(`Unknown state machine: ${machine}`)
  const from = currentState || MACHINES[machine].initial
  if (!canTransition(machine, from, toState)) {
    throw new Error(`Illegal transition in ${machine}: ${from} -> ${toState}`)
  }
  return {
    status: toState,
    status_history_entry: {
      from,
      to: toState,
      actor: actor || 'unknown',
      at: new Date().toISOString(),
    },
  }
}
